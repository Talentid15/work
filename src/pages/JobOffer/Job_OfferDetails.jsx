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
  const user = useSelector((state) => state.user.data); // Get user data for reviewerId
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
      // Load company data from localStorage
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
        // toast.error("Failed to load candidate preferences");
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
        `http://localhost:4000/api/feedback/submit`,
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

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmRetract = () => {
    setShowRetractConfirm(true);
  };

  const confirmGhosted = () => {
    setShowGhostedConfirm(true);
  };

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-500 font-medium text-lg bg-white p-6 rounded-xl shadow-md">
          Offer not found.
        </div>
      </div>
    );
  }

  const { candidate, jobTitle, status, offerDate, expirationDate, offerLetterLink, acceptedLetter } = offer;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <button
          onClick={() => {
            window.location.href = "/joboffers";
          }}
          className="flex items-center gap-2 text-purple-700 hover:text-purple-800 mb-6 font-medium transition-all"
        >
          <MdArrowBack size={20} />
          Back to Offers
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-8">Offer Details</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 p-6 bg-gray-50 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-purple-800 mb-4">Candidate Information</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Name:</strong> {candidate?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {candidate?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {candidate?.phoneNo || "N/A"}
              </p>
            </div>

            <h2 className="text-lg font-semibold text-purple-800 mt-6 mb-4">Offer Details</h2>
            <div className="space-y-2 text-gray-7
00">
              <p>
                <strong>Job Title:</strong> {jobTitle || "N/A"}
              </p>
              <p>
                <strong>Company Size:</strong> {companyData?.companySize || "N/A"} (
                {company_size_value[companyData?.companySize] || "N/A"})
              </p>
              <p>
                <strong>Address:</strong> {companyData?.address || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : status === "Retracted"
                        ? "bg-orange-100 text-orange-700"
                        : status === "Ghosted"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                    }`}
                >
                  {status}
                </span>
              </p>
              <p>
                <strong>Offer Date:</strong>{" "}
                {offerDate ? format(new Date(offerDate), "PPP") : "N/A"}
              </p>
              <p>
                <strong>Expiration Date:</strong>{" "}
                {expirationDate ? format(new Date(expirationDate), "PPP") : "N/A"}
              </p>
              {/* <p>
                <strong>Joining Intent (OfferLens):</strong>{" "}
                {intentScore !== null ? `${intentScore}%` : "Calculating..."}
              </p> */}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className={`px-4 py-2 rounded-lg shadow-md transition-all text-sm font-medium ${viewing === "resume"
                    ? "bg-purple-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                onClick={() => setViewing("resume")}
              >
                Resume
              </button>
              <button
                className={`px-4 py-2 rounded-lg shadow-md transition-all text-sm font-medium ${viewing === "offer"
                    ? "bg-purple-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                onClick={() => setViewing("offer")}
              >
                Offer Letter
              </button>
              {acceptedLetter && (
                <button
                  className={`px-4 py-2 rounded-lg shadow-md transition-all text-sm font-medium ${viewing === "accepted"
                      ? "bg-purple-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  onClick={() => setViewing("accepted")}
                >
                  Accepted Letter
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-gray-100 p-6 rounded-xl shadow-md flex flex-col items-center">
            {viewing === "resume" && candidate?.resumeLink ? (
              <>
                <h2 className="text-lg font-semibold text-purple-800 mb-4">Candidate Resume</h2>
                <iframe
                  src={candidate.resumeLink}
                  className="w-full h-[400px] sm:h-[500px] rounded-lg border border-gray-200"
                  title="Resume"
                ></iframe>
                <a
                  href={candidate.resumeLink}
                  download
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition-all text-sm font-medium"
                >
                  <MdDownload size={18} />
                  Download Resume
                </a>
              </>
            ) : viewing === "offer" && offerLetterLink ? (
              <>
                <h2 className="text-lg font-semibold text-purple-800 mb-4">Offer Letter</h2>
                <iframe
                  src={offerLetterLink}
                  className="w-full h-[400px] sm:h-[500px] rounded-lg border border-gray-200"
                  title="Offer Letter"
                ></iframe>
                <a
                  href={offerLetterLink}
                  download
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition-all text-sm font-medium"
                >
                  <MdDownload size={18} />
                  Download Offer Letter
                </a>
              </>
            ) : viewing === "accepted" && acceptedLetter ? (
              <>
                <h2 className="text-lg font-semibold text-purple-800 mb-4">Accepted Letter</h2>
                <iframe
                  src={acceptedLetter}
                  className="w-full h-[400px] sm:h-[500px] rounded-lg border border-gray-200"
                  title="Accepted Letter"
                ></iframe>
                <a
                  href={acceptedLetter}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition-all text-sm font-medium"
                  download
                >
                  <MdDownload size={18} />
                  Download Accepted Letter
                </a>
              </>
            ) : (
              <p className="text-gray-500 font-medium py-8">No document available.</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={confirmDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all text-sm font-medium"
          >
            Delete Offer
          </button>
          {status === "Pending" ? (
            <>
              <button
                onClick={confirmRetract}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition-all text-sm font-medium"
              >
                Retract Offer
              </button>
              <button
                onClick={confirmGhosted}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all text-sm font-medium"
              >
                Mark as Ghosted
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowFeedbackPopup(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all text-sm font-medium"
            >
              Write Feedback
            </button>
          )}
        </div>

        {/* Delete Confirmation Popup */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this offer? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                >
                  Yes, Delete Offer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Retract Confirmation Popup */}
        {showRetractConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Confirm Retraction</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to retract this offer? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowRetractConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleRetract();
                    setShowRetractConfirm(false);
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-sm font-medium"
                >
                  Yes, Retract Offer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ghosted Confirmation Popup */}
        {showGhostedConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Confirm Ghosted Status</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark this offer as ghosted? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowGhostedConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleGhosted();
                    setShowGhostedConfirm(false);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm font-medium"
                >
                  Yes, Mark as Ghosted
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Submission Popup */}
        {showFeedbackPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Submit Feedback</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating (1–5)</label>
                  <select
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Comment (optional)</label>
                  <textarea
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    maxLength={500}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Share your feedback about the candidate..."
                  />
                </div>
                {feedbackError && (
                  <p className="text-red-500 text-sm">{feedbackError}</p>
                )}
                {feedbackSuccess && (
                  <p className="text-green-500 text-sm">{feedbackSuccess}</p>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowFeedbackPopup(false);
                      setFeedbackRating(1);
                      setFeedbackComment("");
                      setFeedbackError(null);
                      setFeedbackSuccess(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetail;