import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdArrowBack, MdDownload } from "react-icons/md";
import { format } from "date-fns";
import api from "../../utils/api";
import toast from "react-hot-toast";

export const company_size_value = {
  Startup: "1-10",
  Small: "11-50",
  Medium: "51-200",
  Large: "201+",
};

const OfferDetail = () => {
  const token = useSelector((state) => state.user.data?.token);
  const user = useSelector((state) => state.user.data);
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewing, setViewing] = useState("resume");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRetractConfirm, setShowRetractConfirm] = useState(false);
  const [showGhostedConfirm, setShowGhostedConfirm] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(1);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackError, setFeedbackError] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(null);
  const offersData = useSelector((state) => state.offer.data);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";
  const [formulaData, setFormulaData] = useState(null);
  const [intentScore, setIntentScore] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const offer = offersData?.find((offer) => offer._id === id);

  useEffect(() => {
    if (offer) {
      const storedData = localStorage.getItem(`company_${offer.companyName}`);
      if (storedData) {
        setCompanyData(JSON.parse(storedData));
      }
    }
  }, [offer]);

  useEffect(() => {
    const fetchFormulaData = async () => {
      if (!offer) return;
      try {
        const response = await api.get(
          `http://localhost:4000/api/formula/formula/status/${offer.candidate._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setFormulaData(response.data);
      } catch (error) {
        console.error("Error fetching formula data:", error);
        setFormulaData(null);
      }
    };
    fetchFormulaData();
  }, [offer, token, API_URL]);

  const calculateIntentScore = () => {
    if (!offer || !formulaData?.formulaData) return 0;

    const { status, jobTitle, offeredCTC = 0 } = offer;
    const { hasSubmitted, assessmentScore, formulaData: fData } = formulaData;
    const { locationPreferences, expectedCTC, companySizePreferences, rolePreferences } = fData;

    const jobLocation = offer.jobLocation || companyData?.address || "Unknown";
    const companySize = companyData?.companySize || "Unknown";

    let LS = 20;
    if (locationPreferences[0] === jobLocation) LS = 95;
    else if (locationPreferences[1] === jobLocation) LS = 75;
    else if (locationPreferences[2] === jobLocation) LS = 50;
    else if (locationPreferences[3] === jobLocation) LS = 25;

    let SS = 20;
    if (offeredCTC === 0) {
      SS = 20;
    } else if (offeredCTC >= expectedCTC) {
      SS = 95;
    } else {
      SS = Math.max(20, Math.min(95, (offeredCTC / expectedCTC) * 95));
    }

    let CS = 20;
    if (companySizePreferences[0] === companySize) CS = 95;
    else if (companySizePreferences[1] === companySize) CS = 75;
    else if (companySizePreferences[2] === companySize) CS = 50;
    else if (companySizePreferences[3] === companySize) CS = 25;

    let RS = 20;
    if (rolePreferences[0] === jobTitle) RS = 95;
    else if (rolePreferences[1] === jobTitle) RS = 75;
    else if (rolePreferences[2] === jobTitle) RS = 50;
    else if (rolePreferences[3] === jobTitle) RS = 25;

    const QS = hasSubmitted ? assessmentScore : 0;

    if (status === "Rejected") {
      return 0;
    }

    const intent = (LS + SS + CS + RS + QS) / 5;
    return Math.round(intent * 100) / 100;
  };

  useEffect(() => {
    const score = calculateIntentScore();
    setIntentScore(score);
  }, [offer, formulaData, companyData]);

  const handleSubmitFeedback = async () => {
    if (!token) {
      toast.error("No token found. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }
    if (!offer?.candidate?._id) {
      setFeedbackError("Candidate information not available.");
      return;
    }
    setFeedbackError(null);
    setFeedbackSuccess(null);
    try {
      await api.post(
        `${API_URL}/api/feedback/submit`,
        {
          reviewerId: user._id,
          reviewerModel: "User",
          recipientId: offer.candidate._id,
          recipientModel: "HiringCandidate",
          rating: feedbackRating,
          comment: feedbackComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setFeedbackSuccess("Feedback submitted successfully!");
      toast.success("Feedback submitted successfully!");
      setTimeout(() => {
        setShowFeedbackPopup(false);
        setFeedbackRating(1);
        setFeedbackComment("");
      }, 1500);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit feedback.";
      setFeedbackError(errorMessage);
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    }
  };

  const handleRetract = async () => {
    try {
      const response = await api.post(
        `${API_URL}/api/offer/offer/updateStatus`,
        { offerId: id, status: "Retracted" },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data) {
        toast.success("Offer retracted successfully");
        navigate(0);
      } else {
        throw new Error("Failed to retract offer");
      }
    } catch (error) {
      console.error("Error retracting offer:", error);
      toast.error(`Failed to retract offer: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api.post(
        `${API_URL}/api/offer/update-show-status`,
        { offerId: id, showOffer: false },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data) {
        toast.success("Offer deleted successfully");
        navigate("/joboffers");
      } else {
        throw new Error("Failed to delete offer");
      }
    } catch (error) {
      console.error("Error hiding offer:", error);
      toast.error(`Failed to delete offer: ${error.message}`);
    }
  };

  const handleGhosted = async () => {
    try {
      const response = await api.post(
        `${API_URL}/api/offer/offer/updateStatus`,
        { offerId: id, status: "Ghosted" },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data) {
        toast.success("Offer marked as ghosted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        throw new Error("Failed to mark offer as ghosted");
      }
    } catch (error) {
      console.error("Error marking offer as ghosted:", error);
      toast.error(`Failed to mark offer as ghosted: ${error.message}`);
    }
  };

  if (!offer) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-500 font-medium text-lg bg-white p-6 rounded-xl shadow-md">
          Offer not found.
        </div>
      </div>
    );
  }

  const { candidate, jobTitle, status, offerDate, expirationDate, offerLetterLink, acceptedLetter } = offer;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/joboffers")}
            className="flex items-center gap-2 text-purple-700 hover:text-purple-800 font-medium transition-all"
          >
            <MdArrowBack size={18} />
            Back to Offers
          </button>
          <h1 className="text-xl font-bold text-purple-800">Offer Details</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden p-3">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 h-full">
          {/* Left panel - Candidate info */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2 overflow-y-auto">
            <h2 className="text-base font-semibold text-purple-800 mb-2">Candidate Information</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {candidate?.name || "N/A"}</p>
              <p><strong>Email:</strong> {candidate?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {candidate?.phoneNo || "N/A"}</p>
              <p><strong>Job Title:</strong> {jobTitle || "N/A"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                  status === "Retracted" ? "bg-orange-100 text-orange-700" :
                  status === "Ghosted" ? "bg-red-100 text-red-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {status}
                </span>
              </p>
              <p><strong>Company Size:</strong> {companyData?.companySize || "N/A"}</p>
              <p className="col-span-2"><strong>Address:</strong> {companyData?.address || "N/A"}</p>
              <p><strong>Offer Date:</strong> {offerDate ? format(new Date(offerDate), "PP") : "N/A"}</p>
              <p><strong>Expiration:</strong> {expirationDate ? format(new Date(expirationDate), "PP") : "N/A"}</p>
            </div>

            {/* Document tabs */}
            <div className="mt-4 flex gap-2">
              <button
                className={`px-3 py-1 rounded text-xs font-medium ${viewing === "resume" 
                  ? "bg-purple-700 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setViewing("resume")}
              >
                Resume
              </button>
              <button
                className={`px-3 py-1 rounded text-xs font-medium ${viewing === "offer" 
                  ? "bg-purple-700 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setViewing("offer")}
              >
                Offer
              </button>
              {acceptedLetter && (
                <button
                  className={`px-3 py-1 rounded text-xs font-medium ${viewing === "accepted" 
                    ? "bg-purple-700 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  onClick={() => setViewing("accepted")}
                >
                  Accepted
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
              >
                Delete Offer
              </button>
              {status === "Pending" ? (
                <>
                  <button
                    onClick={() => setShowRetractConfirm(true)}
                    className="px-3 py-1.5 bg-orange-600 text-white rounded text-xs font-medium hover:bg-orange-700"
                  >
                    Retract Offer
                  </button>
                  <button
                    onClick={() => setShowGhostedConfirm(true)}
                    className="px-3 py-1.5 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700 col-span-2"
                  >
                    Mark as Ghosted
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowFeedbackPopup(true)}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700"
                >
                  Write Feedback
                </button>
              )}
            </div>
          </div>

          {/* Right panel - Document viewer */}
          <div className="bg-white rounded-lg shadow-sm lg:col-span-3 flex flex-col h-full">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base font-semibold text-purple-800">
                {viewing === "resume" ? "Candidate Resume" : 
                 viewing === "offer" ? "Offer Letter" : "Accepted Letter"}
              </h2>
                 {/* <a href={candidate?.resumeLink}>ss</a> */}
              {(viewing === "resume" && candidate?.resumeLink) || 
               (viewing === "offer" && offerLetterLink) ||
               (viewing === "accepted" && acceptedLetter) ? (
                <a
                  href={
                    viewing === "resume" ? candidate?.resumeLink :
                    viewing === "offer" ? offerLetterLink : acceptedLetter
                  }
                  download
                  className="flex items-center gap-1 px-2 py-1 bg-purple-700 text-white rounded text-xs font-medium hover:bg-purple-800"
                >
                  <MdDownload size={14} />
                  Download
                </a>
              ) : null}
            </div>

            <div className="flex-1 p-2">
              {(viewing === "resume" && candidate?.resumeLink) ? (
                <iframe
                  src={candidate.resumeLink}
                  className="w-full h-full rounded border border-gray-200"
                  title="Resume"
                ></iframe>
              ) : (viewing === "offer" && offerLetterLink) ? (
                <iframe
                  src={offerLetterLink}
                  className="w-full h-full rounded border border-gray-200"
                  title="Offer Letter"
                ></iframe>
              ) : (viewing === "accepted" && acceptedLetter) ? (
                <iframe
                  src={acceptedLetter}
                  className="w-full h-full rounded border border-gray-200"
                  title="Accepted Letter"
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 font-medium">
                  No document available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-base font-semibold text-purple-800 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this offer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retract Confirmation Modal */}
      {showRetractConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-base font-semibold text-purple-800 mb-2">Confirm Retraction</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to retract this offer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRetractConfirm(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRetract();
                  setShowRetractConfirm(false);
                }}
                className="px-3 py-1.5 bg-orange-600 text-white rounded text-xs font-medium hover:bg-orange-700"
              >
                Retract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ghosted Confirmation Modal */}
      {showGhostedConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-base font-semibold text-purple-800 mb-2">Confirm Ghosted Status</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to mark this offer as ghosted? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowGhostedConfirm(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleGhosted();
                  setShowGhostedConfirm(false);
                }}
                className="px-3 py-1.5 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700"
              >
                Mark as Ghosted
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-base font-semibold text-purple-800 mb-2">Submit Feedback</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Rating (1–5)</label>
                <select
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(Number(e.target.value))}
                  className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Comment (optional)</label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Share your feedback about the candidate..."
                ></textarea>
              </div>
              {feedbackError && <p className="text-red-500 text-xs">{feedbackError}</p>}
              {feedbackSuccess && <p className="text-green-500 text-xs">{feedbackSuccess}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowFeedbackPopup(false);
                  setFeedbackRating(1);
                  setFeedbackComment("");
                  setFeedbackError(null);
                  setFeedbackSuccess(null);
                }}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferDetail;