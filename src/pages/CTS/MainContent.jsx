import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi";
import { FaCircle, FaFileCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";

import PopUps from "../../components/PopUps";

import StatusCard from "./StatusCard";


const MainContent = () => {
  const [showPopups, setShowPopups] = useState(false);

  const handleClosePopup = () => setShowPopups(false);

  const [email, setEmail] = useState('');

  const [searchedResponseData, setSearchedResponseData] = useState(null);


  return (
    <div className="flex-1 p-5 bg-[#F4F4F4] relative">
      <header className="w-auto max-w-[350px] ml-auto flex justify-end items-center bg-white rounded-full p-2">
        <div className="flex items-center">
          <button className="flex items-center px-3 py-2 bg-[#74449E] text-white font-semibold rounded-full hover:bg-[#5a2889] space-x-3 transition duration-200">
            <HiOutlineUsers className="h-5 w-5" />
            <span>Track Candidate</span>
          </button>

          <Link to="history">
            <button className="flex items-center px-5 py-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 space-x-3 transition duration-200">
              <FaFileCircleQuestion className="h-5 w-5" />
              <span>History</span>
            </button>
          </Link>
        </div>
      </header>

      <div className="flex flex-col justify-center items-center p-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Track Candidate Status
        </h1>

        <div className="flex items-center space-x-4 justify-center mb-10 w-full max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter email address"
              onChange={(event) => setEmail(event.target.value)}
              className="w-full p-4 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
            />
            <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
          </div>

          <button
            onClick={() => setShowPopups(true)}
            className="px-6 py-3 bg-[#803CD8] text-white font-medium rounded-full shadow-custom-purple hover:shadow-xl transition duration-200"
          >
            Check Status
          </button>
        </div>
      </div>

      {/* Popup with Blur Effect */}
      {showPopups && (

        <PopUps setshowPopUps={setShowPopups} showPopups={showPopups}
          emailSearch={email}
          searchedResponseData={searchedResponseData}
          setSearchedResponseData={setSearchedResponseData}

        />

      )}


      <div className="flex items-center justify-center border-2 border-[#c7c6c6] bg-[#E7E7E7] rounded-3xl p-6 max-w-[790px] mx-auto scroll-auto">
        <div className="flex flex-wrap justify-around gap-4 h-[18rem]  overflow-y-auto">
          <StatusCard
            company="Google"
            status="Final Round"
            statusColor="text-green-600"
            iconColor="#3DBF28"
          />
          <StatusCard
            company="Microsoft"
            status="Final Round"
            statusColor="text-green-600"
            iconColor="#3DBF28"
          />
          <StatusCard
            company="TalentID"
            status="Screening"
            statusColor="text-red-500"
            iconColor="#FF3F3F"
          />
          <StatusCard
            company="Adobe"
            status="Final Round"
            statusColor="text-green-600"
            iconColor="#3DBF28"
          />

          <StatusCard
            company="TalentID"
            status="Screening"
            statusColor="text-red-500"
            iconColor="#FF3F3F"
          />
          <StatusCard
            company="Adobe"
            status="Final Round"
            statusColor="text-green-600"
            iconColor="#3DBF28"
          />

        </div>
      </div>

    </div>
  );
};

export default MainContent;
