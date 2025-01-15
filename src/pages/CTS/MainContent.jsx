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
    <div className="flex-1 p-5 bg-white relative">
      <header className="flex justify-center gap-28 items-center bg-white rounded-2xl p-2 mb-4 ">
              <Link to="/">
                <button className="flex items-center px-3 py-2 w-[120%] bg-[#74449E]  font-semibold rounded-lg text-white hover:bg-[#5a2889] space-x-2 transition duration-200">
                  <HiOutlineUsers className="h-5 w-5" />
                  <span>Track Candidate</span>
                </button>
              </Link>
      
              <Link to="/history">
                <button className="flex w-[160%] items-center px-5 py-2 bg-white text-gray-800 border border-purple-500 rounded-lg hover:bg-gray-100 space-x-3 transition duration-200">
                  <FaFileCircleQuestion className="h-5 w-5" />
                  <span >History</span>
                </button>
              </Link>
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
            className="px-6 py-3 bg-[#803CD8] text-white font-medium rounded-full  hover:shadow-2xl  hover:scale-105 transition duration-200"
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


<div className="flex items-center justify-center border-2 scrollbar-hidden border-[#c7c6c6] bg-[#E7E7E7] rounded-3xl p-6 max-w-[790px] mx-auto">
  <div className="flex flex-wrap justify-around gap-4 h-[18rem] overflow-y-auto  no-scrollbar">
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
