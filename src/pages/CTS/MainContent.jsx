import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import PopUps from "../../components/PopUps";
import StatusCard from "./StatusCard";
import NotFoundPage from "../../components/common/NotFoundPage";

const MainContent = () => {
  const [showPopups, setShowPopups] = useState(false);
  const [email, setEmail] = useState("");
  const [searchedResponseData, setSearchedResponseData] = useState(null);
  const [isError, setError] = useState("");
  const [active, setActive] = useState("People");

  const userPipeLineData = useSelector((state) => state.user.pipelineData);

  const handleClosePopup = () => setShowPopups(false);

  const handleSearch = () => {
    // Simulate a search process
    setShowPopups(true);
  };

  return (
    <div className="flex-1 bg-white relative w-auto">
      {/* Navigation Buttons */}
      <div className="max-w-sm ml-auto h-auto p-2 bg-white rounded-full shadow-lg">
        <div className="flex justify-center gap-2">
          <Link to="/">
            <button
              className={`flex items-center gap-2 px-6 py-2 font-medium text-sm rounded-full transition duration-200 ${
                active === "People"
                  ? "bg-[#74449E] text-white"
                  : "text-gray-700 hover:bg-gray-100"
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
                active === "history"
                  ? "bg-[#74449E] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActive("history")}
            >
              <FaFileCircleQuestion className="h-5 w-5" />
              History
            </button>
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-col justify-center items-center p-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 text-center mb-10 mt-5">
          Track Candidate Status
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 w-full max-w-xl">
          <div className="relative w-full md:flex-1">
            <input
              type="text"
              placeholder="Enter email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
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

      {/* Results Section */}
      <div className={`flex items-center relative w-full h-full justify-center scrollbar-hidden ${searchedResponseData !== null ? "border-[#c7c6c6] border-2 bg-[#E7E7E7] rounded-3xl p-6 max-w-[790px]":"w-auto"} mx-auto mt-5`}>
        <div className={`flex relative w-full flex-wrap justify-around gap-4 ${searchedResponseData !== null ?"h-[18rem]":"h-[18rem]"} overflow-y-auto no-scrollbar`}>
          {searchedResponseData && isError === "" ? (
            searchedResponseData.map((resData, index) => (
              <StatusCard
                key={index}
                company={resData.companyName}
                status={resData.currentStatus}
                statusColor="text-green-600"
                iconColor="#3DBF28"
              />
            ))
          ) : searchedResponseData === null && isError === "not_found" ? (
            <NotFoundPage />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MainContent;

