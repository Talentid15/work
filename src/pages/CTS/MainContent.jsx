import { useState, useContext } from "react";
import { BiSearch } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { PipelineContext } from "../../context/PipelineContext";
import PopUps from "../../components/PopUps";
import NotFoundPage from "../../components/common/NotFoundPage";

const StatusCard = ({ company, status, offerDate, statusColor, iconColor }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-full max-w-xs">
      <div className="flex items-center justify-center w-12 h-12 rounded-full mb-3" style={{ backgroundColor: `${iconColor}20` }}>
        <HiOutlineUsers className="h-6 w-6" style={{ color: iconColor }} />
      </div>
      <h3 className="text-lg font-semibold text-center">{company}</h3>
      <p className={`text-sm font-medium ${statusColor}`}>{status}</p>
      {offerDate && (
        <p className="text-xs text-gray-500 mt-1">Offer Date: {offerDate}</p>
      )}
    </div>
  );
};

const CandidateDetails = ({ data }) => {
  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Candidate Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {data.email}
          </p>
          {data.name && (
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {data.name}
            </p>
          )}
          {data.phone && (
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> {data.phone}
            </p>
          )}
        </div>
        {data.appliedCompanies?.length > 0 && (
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">Total Applications:</span> {data.appliedCompanies.length}
            </p>
            {data.resume && (
              <a 
                href={data.resume} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-block text-purple-600 hover:underline"
              >
                View Resume
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const HiringCandidateDetails = ({ data }) => {
  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Hiring Process Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {data.email}
          </p>
          {data.name && (
            <p className="text-gray-700">
              <span className="font-semibold">Candidate Name:</span> {data.name}
            </p>
          )}
          {data.currentStage && (
            <p className="text-gray-700">
              <span className="font-semibold">Current Stage:</span> {data.currentStage}
            </p>
          )}
        </div>
        <div className="space-y-3">
          {data.totalOffers && (
            <p className="text-gray-700">
              <span className="font-semibold">Total Offers:</span> {data.totalOffers}
            </p>
          )}
          {data.lastUpdated && (
            <p className="text-gray-700">
              <span className="font-semibold">Last Updated:</span> {new Date(data.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  const [showPopups, setShowPopups] = useState(false);
  const [email, setEmail] = useState("");
  const { searchedResponseData, setSearchedResponseData } = useContext(PipelineContext);
  const [isError, setError] = useState("");
  const [active, setActive] = useState("People");

  const handleSearch = () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setShowPopups(true);
    setError("");
  };

  const renderContent = () => {
    if (!searchedResponseData) return null;

    const hasData = 
      (searchedResponseData.filteredAppliedCompanies?.length > 0) ||
      (searchedResponseData.signedOfferData?.length > 0) ||
      (searchedResponseData.candidateData) ||
      (searchedResponseData.hiringCandidateData);

    if (!hasData) {
      return (
        <div className="w-full py-12">
          <NotFoundPage />
        </div>
      );
    }

    return (
      <div className="w-full space-y-8">
        {/* Candidate Details */}
        {searchedResponseData.candidateData && (
          <CandidateDetails data={searchedResponseData.candidateData} />
        )}

        {/* Hiring Candidate Details */}
        {searchedResponseData.hiringCandidateData && (
          <HiringCandidateDetails data={searchedResponseData.hiringCandidateData} />
        )}

        {/* Applied Companies Section */}
        {searchedResponseData.filteredAppliedCompanies?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Applied Companies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchedResponseData.filteredAppliedCompanies.map((resData, index) => (
                <StatusCard
                  key={`applied-${index}`}
                  company={resData.companyName}
                  status={resData.currentStatus}
                  statusColor="text-green-600"
                  iconColor="#3DBF28"
                />
              ))}
            </div>
          </div>
        )}

        {/* Signed Offers Section */}
        {searchedResponseData.signedOfferData?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Signed Offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchedResponseData.signedOfferData.map((offer, index) => (
                <StatusCard
                  key={`signed-${index}`}
                  company={offer.jobTitle || "Unknown Position"}
                  status={offer.status || "Offer Signed"}
                  offerDate={offer.offerDate && new Date(offer.offerDate).toLocaleDateString()}
                  statusColor="text-blue-600"
                  iconColor="#803CD8"
                />
              ))}
            </div>
          </div>
        )}

        {/* Hiring Candidate Offers Section */}
        {searchedResponseData.hiringCandidateData?.allOfferData?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">All Offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchedResponseData.hiringCandidateData.allOfferData.map((offer, index) => (
                <StatusCard
                  key={`offer-${index}`}
                  company={offer.jobTitle || "Unknown Position"}
                  status={offer.status || "Offer Received"}
                  offerDate={offer.offerDate && new Date(offer.offerDate).toLocaleDateString()}
                  statusColor="text-orange-600"
                  iconColor="#FF9800"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white relative w-auto min-h-screen">
      {/* Header with Navigation */}
      <div className="max-w-sm ml-auto h-auto p-2 bg-white rounded-full shadow-lg sticky top-4 z-10">
        <div className="flex justify-center gap-2">
          <Link to="/">
            <button
              className={`flex items-center gap-2 px-6 py-2 font-medium text-sm rounded-full transition duration-200 ${
                active === "People" ? "bg-[#74449E] text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActive("People")}
            >
              <HiOutlineUsers className="h-5 w-5" />
              Track Candidate
            </button>
          </Link>

          <Link to="/history">
            <button
              className={`flex items-center gap-2 px-6 py-2 font-medium text-sm rounded-full transition duration-200 ${
                active === "history" ? "bg-[#74449E] text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActive("history")}
            >
              <FaFileCircleQuestion className="h-5 w-5" />
              History
            </button>
          </Link>
        </div>
      </div>

      {/* Main Search Area */}
      <div className="flex flex-col justify-center items-center p-4 pt-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 text-center mb-10 mt-5">
          Search Candidate Pipeline
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 w-full max-w-xl">
          <div className="relative w-full md:flex-1">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>

          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-[#803CD8] text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition duration-200"
          >
            Check Status
          </button>
        </div>

        {isError && (
          <p className="mt-2 text-sm text-red-600">{isError}</p>
        )}
      </div>

      {/* Popup for Authentication/Confirmation */}
      {showPopups && (
        <PopUps
          setshowPopUps={setShowPopups}
          showPopups={showPopups}
          emailSearch={email}
          searchedResponseData={searchedResponseData}
          setSearchedResponseData={setSearchedResponseData}
          setError={setError}
        />
      )}

      {/* Results Display Area */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainContent;