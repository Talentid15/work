import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdArrowBack, MdDownload } from "react-icons/md";
import { format } from "date-fns";
import api from "../../utils/api";

const OfferDetail = () => {
  const token = useSelector((state) => state.user.data?.token);
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewing, setViewing] = useState("resume");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRetractConfirm, setShowRetractConfirm] = useState(false);
  const offersData = useSelector((state) => state.offer.data);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

  const offer = offersData?.find((offer) => offer._id === id);

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
        alert('Offer retracted successfully');
        navigate(0);
      } else {
        throw new Error('Failed to retract offer');
      }
    } catch (error) {
      console.error('Error retracting offer:', error);
      alert(`Failed to retract offer: ${error.message}`);
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
        alert('Offer hidden successfully');
        navigate('/joboffers');
      } else {
        throw new Error('Failed to Delete offer');
      }
    } catch (error) {
      console.error('Error hiding offer:', error);
      alert(`Failed to Delete offer: ${error.message}`);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmRetract = () => {
    setShowRetractConfirm(true);
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Back Button */}
        <button
          onClick={() => {window.location.href = '/joboffers'}}
          className="flex items-center gap-2 text-purple-700 hover:text-purple-800 mb-6 font-medium transition-all"
        >
          <MdArrowBack size={20} />
          Back to Offers
        </button>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-8">Offer Details</h1>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Candidate & Offer Info */}
          <div className="w-full lg:w-1/2 p-6 bg-gray-50 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-purple-800 mb-4">Candidate Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Name:</strong> {candidate?.name || "N/A"}</p>
              <p><strong>Email:</strong> {candidate?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {candidate?.phoneNo || "N/A"}</p>
            </div>

            <h2 className="text-lg font-semibold text-purple-800 mt-6 mb-4">Offer Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Job Title:</strong> {jobTitle || "N/A"}</p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : status === "Retracted"
                      ? "bg-orange-100 text-orange-700"
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
            </div>

            {/* Document Tabs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className={`px-4 py-2 rounded-lg shadow-md transition-all text-sm font-medium ${
                  viewing === "resume"
                    ? "bg-purple-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setViewing("resume")}
              >
                Resume
              </button>
              <button
                className={`px-4 py-2 rounded-lg shadow-md transition-all text-sm font-medium ${
                  viewing === "offer"
                    ? "bg-purple-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setViewing("offer")}
              >
                Offer Letter
              </button>
              {acceptedLetter && (
                <button
                  className={`px-4 py-2 rounded-lg shadow-md transition-all text-sm font-medium ${
                    viewing === "accepted"
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

          {/* Document Viewer */}
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

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={confirmDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all text-sm font-medium"
          >
            Delete Offer
          </button>
          {status === "Pending" && (
            <button
              onClick={confirmRetract}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition-all text-sm font-medium"
            >
              Retract Offer
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
      </div>
    </div>
  );
};

export default OfferDetail;