import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdArrowBack, MdDownload } from "react-icons/md";
import { format } from "date-fns";

const OfferDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const offersData = useSelector((state) => state.offer.data);

  console.log("Offer data:", offersData);

  // Find the offer by ID
  const offer = offersData?.find((offer) => offer._id === id);

  if (!offer) {
    return <div className="text-center mt-10 text-red-500">Offer not found.</div>;
  }

  const { candidate, jobTitle, status, offerDate, expirationDate, offerLetterLink } = offer;

  // State to track which document is being viewed
  const [viewing, setViewing] = useState("resume"); // Default: Show Resume

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6 border border-gray-200">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
        <MdArrowBack size={20} />
        Back to Offers
      </button>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Offer Details</h1>

      {/* Layout - Candidate Details on the left, Document Viewer on the right */}
      <div className="flex flex-col md:flex-row gap-6 mt-5">
        {/* Left Section - Candidate Info & Toggle Buttons */}
        <div className="w-full md:w-1/2 p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Candidate Information</h2>
          <p className="text-gray-600"><strong>Name:</strong> {candidate?.name || "N/A"}</p>
          <p className="text-gray-600"><strong>Email:</strong> {candidate?.email || "N/A"}</p>
          <p className="text-gray-600"><strong>Phone:</strong> {candidate?.phoneNo || "N/A"}</p>

          {/* Offer Details */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700">Offer Details</h2>
            <p className="text-gray-600"><strong>Job Title:</strong> {jobTitle}</p>
            <p className="text-gray-600"><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full ${status === "Pending" ? "bg-yellow-200" : "bg-green-200"}`}>
                {status}
              </span>
            </p>
            <p className="text-gray-600"><strong>Offer Date:</strong> {format(new Date(offerDate), "PPP")}</p>
            <p className="text-gray-600"><strong>Expiration Date:</strong> {format(new Date(expirationDate), "PPP")}</p>
          </div>

          {/* Toggle Buttons */}
          <div className="mt-6 flex gap-4">
            <button 
              className={`px-4 py-2 rounded-lg shadow-md transition-all ${
                viewing === "resume" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setViewing("resume")}
            >
              View Resume
            </button>
            <button 
              className={`px-4 py-2 rounded-lg shadow-md transition-all ${
                viewing === "offer" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setViewing("offer")}
            >
              View Offer Letter
            </button>
          </div>
        </div>

        {/* Right Section - Document Viewer */}
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
          ) : (
            <p className="text-gray-500">No document available.</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-between">
        <button className="px-5 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all">
          Delete Offer
        </button>
      </div>
    </div>
  );
};

export default OfferDetail;
