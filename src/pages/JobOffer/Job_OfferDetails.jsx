import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdArrowBack, MdDownload } from "react-icons/md";
import { format } from "date-fns";
import axios from "axios";

const OfferDetail = () => {
  const { token } = useSelector((state) => state.user.data || {});
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewing, setViewing] = useState("resume");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRetractConfirm, setShowRetractConfirm] = useState(false);
  const offersData = useSelector((state) => state.offer.data);

  const offer = offersData?.find((offer) => offer._id === id);   
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL?? '';

  if (!offer) {
    return <div className="text-center mt-10 text-red-500">Offer not found.</div>;
  }

  const { candidate, jobTitle, status, offerDate, expirationDate, offerLetterLink, acceptedLetter } = offer;

  const handleRetract = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/offer/offer/updateStatus`,
        { offerId: id, status: "Retracted" },
        {
          // headers: { Authorization: `Bearer ${token}` },
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
      const response = await axios.post(
        `${API_URL}/api/offer/update-show-status`,
        { offerId: id, showOffer: false },
        {
          // headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data) {
        alert('Offer hidden successfully');
        navigate('/joboffers');
      } else {
        throw new Error('Failed to hide offer');
      }
    } catch (error) {
      console.error('Error hiding offer:', error);
      alert(`Failed to hide offer: ${error.message}`);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmRetract = () => {
    setShowRetractConfirm(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6 border border-gray-200">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <MdArrowBack size={20} />
        Back to Offers
      </button>

      <h1 className="text-2xl font-bold text-gray-800">Offer Details</h1>

      <div className="flex flex-col md:flex-row gap-6 mt-5">
        <div className="w-full md:w-1/2 p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Candidate Information</h2>
          <p className="text-gray-600">
            <strong>Name:</strong> {candidate?.name || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {candidate?.email || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> {candidate?.phoneNo || "N/A"}
          </p>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700">Offer Details</h2>
            <p className="text-gray-600">
              <strong>Job Title:</strong> {jobTitle}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-full ${status === "Pending" ? "bg-yellow-200" :
                    status === "Retracted" ? "bg-orange-200" : "bg-green-200"}`}
              >
                {status}
              </span>
            </p>
            <p className="text-gray-600">
              <strong>Offer Date:</strong> {format(new Date(offerDate), "PPP")}
            </p>
            <p className="text-gray-600">
              <strong>Expiration Date:</strong> {format(new Date(expirationDate), "PPP")}
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg shadow-md transition-all ${viewing === "resume" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setViewing("resume")}
            >
              Resume
            </button>
            <button
              className={`px-4 py-2 rounded-lg shadow-md transition-all ${viewing === "offer" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setViewing("offer")}
            >
              Offer Letter
            </button>
            {acceptedLetter && (
              <button
                className={`px-4 py-2 rounded-lg shadow-md transition-all ${viewing === "accepted" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setViewing("accepted")}
              >
                Accepted Letter
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          {viewing === "resume" && candidate?.resumeLink ? (
            <>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Candidate Resume</h2>
              <iframe
                src={candidate.resumeLink}
                className="w-full h-[500px] rounded-lg border"
                title="Resume"
              ></iframe>
              <a
                href={candidate.resumeLink}
                download
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
              >
                <MdDownload size={18} />
                Download Resume
              </a>
            </>
          ) : viewing === "offer" && offerLetterLink ? (
            <>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Offer Letter</h2>
              <iframe
                src={offerLetterLink}
                className="w-full h-[500px] rounded-lg border"
                title="Offer Letter"
              ></iframe>
              <a
                href={offerLetterLink}
                download
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
              >
                <MdDownload size={18} />
                Download Offer Letter
              </a>
            </>
          ) : viewing === "accepted" && acceptedLetter ? (
            <>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Accepted Letter</h2>
              <iframe
                src={acceptedLetter}
                className="w-full h-[500px] rounded-lg border"
                title="Accepted Letter"
              ></iframe>
              <a
                href={acceptedLetter}
                download
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
              >
                <MdDownload size={18} />
                Download Accepted Letter
              </a>
            </>
          ) : (
            <p className="text-gray-500">No document available.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div className="flex gap-4">
          <button 
            onClick={confirmDelete}
            className="px-5 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
          >
            Delete Offer
          </button>
          {status === "Pending" && (
            <button
              onClick={confirmRetract}
              className="px-5 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-all"
            >
              Retract Offer
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6">Do you really want to hide this offer? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Yes, Hide Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retract Confirmation Popup */}
      {showRetractConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6">Do you really want to retract this offer? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRetractConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRetract();
                  setShowRetractConfirm(false);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
              >
                Yes, Retract Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferDetail;