import { useState, useContext } from "react";
import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { PipelineContext } from "../../context/PipelineContext";
import PopUps from "../../components/PopUps";
import Navbar from "./SideNav";
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion, FaUserPlus } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";

const StatusCard = ({ company, status, offerDate, statusColor, iconColor }) => {
  return (
    <div className="flex flex-col items-center p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-full mb-4"
        style={{ backgroundColor: `${iconColor}20` }}
      >
        <HiOutlineUsers className="h-7 w-7" style={{ color: iconColor }} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center truncate w-full">
        {company || "N/A"}
      </h3>
      <p className={`text-sm font-medium ${statusColor} mt-1`}>{status || "Unknown"}</p>
      {offerDate && (
        <p className="text-xs text-gray-500 mt-2">Offer Date: {offerDate}</p>
      )}
    </div>
  );
};

const HiringCandidateDetails = ({ data }) => {
  return (
    <div className="mb-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-5 text-gray-900">Hiring Process Details</h2>
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
      <div className="w-full space-y-10">
        {searchedResponseData.hiringCandidateData && (
          <HiringCandidateDetails data={searchedResponseData.hiringCandidateData} />
        )}

        {searchedResponseData.filteredAppliedCompanies?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Applied Companies</h2>
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
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Signed Offers</h2>
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
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">All Offers</h2>
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
    <div className="flex-1 min-h-screen pt-10">
      <div className="w-full relative flex flex-col md:flex-row align-start justify-between pb-5 px-10 border-b border-gray-300 mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button className="flex items-center text-gray-800 focus:outline-none" >
            <IoIosArrowBack className="text-2xl mr-4" onClick={() => {

              navigate("/")

            }} />
            <span className="font-bold text-xl md:text-2xl">Search Candidate</span>
          </button>
        </div>

        <div className="flex justify-end items-center gap-4">
          <Link to="/">
            <button className="flex items-center px-4 py-2  font-semibold bg-purple-900 rounded-full text-white space-x-3 transition duration-200 shadow-md">
              <HiOutlineUsers className="h-5 w-5" />
              <span>Track Candidate</span>
            </button>
          </Link>

          <Link to="/history">
            <button
              className={`flex items-center gap-2 px-5 py-2 font-medium text-sm rounded-full transition-all duration-300 ${"text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
            >
              <FaFileCircleQuestion className="h-5 w-5" />
              History
            </button>
          </Link>
          <Link to="/invite">
            <button
              className={`flex items-center gap-2 px-5 py-2 font-medium text-sm rounded-full transition-all duration-300 ${"text-gray-700 hover:shadow-sm"
                }`}
            >
              <FaUserPlus className="h-5 w-5" />
              Invites
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
          Search Candidate Pipeline
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl">
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 pl-12 border border-gray-200 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#803CD8] transition-all duration-200"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 min-w-40 py-3 bg-gradient-to-r from-[#74449E] to-[#803CD8] text-white font-semibold rounded-full shadow-lg hover:shadow-xl  transition-all duration-300"
          >
            Check Status
          </button>
        </div>
        {isError && <p className="mt-3 text-sm text-red-500 font-medium">{isError}</p>}
      </div>

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

      {/* Results */}
      <div className="w-full max-w-7xl mx-auto px-6 py-10">{renderContent()}</div>
    </div>
  );
};

export default MainContent;