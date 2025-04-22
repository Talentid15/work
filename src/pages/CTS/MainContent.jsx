import { useState, useContext } from "react";
import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { PipelineContext } from "../../context/PipelineContext";
import PopUps from "../../components/PopUps";
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion, FaUserPlus } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";

const StatusCard = ({ company, status, offerDate, statusColor, iconColor }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
        style={{ backgroundColor: `${iconColor}20` }}
      >
        <HiOutlineUsers className="h-6 w-6" style={{ color: iconColor }} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center truncate w-full">
        {company || "N/A"}
      </h3>
      <p className={`text-sm font-medium ${statusColor} mt-2`}>{status || "Unknown"}</p>
      {offerDate && (
        <p className="text-xs text-gray-500 mt-2">Offer Date: {offerDate}</p>
      )}
    </div>
  );
};

const HiringCandidateDetails = ({ data }) => {
  return (
    <div className="mb-12 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Hiring Process Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-gray-700">
            <span className="font-semibold text-gray-900">Email:</span> {data?.email || "N/A"}
          </p>
          {data?.name && (
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">Candidate Name:</span> {data.name}
            </p>
          )}
          {data?.currentStage && (
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">Current Stage:</span> {data.currentStage}
            </p>
          )}
        </div>
        <div className="space-y-4">
          {data?.totalOffers && (
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">Total Offers:</span> {data.totalOffers}
            </p>
          )}
          {data?.lastUpdated && (
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">Last Updated:</span>{" "}
              {new Date(data.lastUpdated).toLocaleDateString()}
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
  const navigate = useNavigate();

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

    return (
      <div className="w-full space-y-12">
        {searchedResponseData.hiringCandidateData && (
          <HiringCandidateDetails data={searchedResponseData.hiringCandidateData} />
        )}

        {searchedResponseData.filteredAppliedCompanies?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Applied Companies</h2>
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

        {searchedResponseData.signedOfferData?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Signed Offers</h2>
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

        {searchedResponseData.hiringCandidateData?.allOfferData?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Offers</h2>
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
    <div className="min-h-screen  flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r mt-10 from-purple-700 rounded-full to-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-white hover:text-purple-200 transition-colors duration-200"
              aria-label="Go back"
            >
              <IoIosArrowBack className="text-2xl" />
              <span className="ml-2 text-lg font-semibold">Search Candidate</span>
            </button>
          </div>
          <nav className="flex space-x-3 mt-4 sm:mt-0">
            <Link to="/">
              <button className="flex items-center px-4 py-2 text-purple-900 bg-white rounded-full hover:bg-purple-100 transition-all duration-200 shadow-md">
                <HiOutlineUsers className="h-5 w-5 mr-2" />
                Track
              </button>
            </Link>
            <Link to="/history">
              <button className="flex items-center px-4 py-2 text-white bg-transparent border border-white rounded-full hover:bg-purple-600 hover:border-transparent transition-all duration-200">
                <FaFileCircleQuestion className="h-5 w-5 mr-2" />
                History
              </button>
            </Link>
            <Link to="/invite">
              <button className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-all duration-200 shadow-md">
                <FaUserPlus className="h-5 w-5 mr-2" />
                Invites
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center animate-fade-in">
          Search Candidate Pipeline
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
          <div className="relative w-full group">
            <input
              type="email"
              placeholder="Enter candidate email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full p-4 pl-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
              aria-label="Search candidate by email"
            />
            <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 group-hover:text-purple-600 transition-colors duration-200" />
          </div>
          <button onClick={handleSearch} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300" aria-label="Search candidate">Check Status</button>

        </div>
        {isError && (
          <p className="mt-4 text-sm text-red-500 text-center animate-pulse">{isError}</p>
        )}
        <div className="w-full max-w-7xl mx-auto px-4 py-12">{renderContent()}</div>
      </main>

      {/* Popup */}
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
    </div>
  );
};

export default MainContent;