import React from "react";
import { BiSearch } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi";
import { FaCircle, FaFileCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";

const MainContent = () => {
  return (
    <div className="flex-1 p-5 bg-[#F4F4F4]">

      <header className="w-auto max-w-[330px] ml-auto flex justify-end items-center mb-2 bg-white rounded-full p-2">
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
              placeholder="Enter email address or phone number"
              className="w-full p-4 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
            />
            <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
          </div>

          <button className="px-6 py-3 bg-[#803CD8] text-white font-medium rounded-full shadow-custom-purple hover:shadow-xl transition duration-200">
            Check Status
          </button>
        </div>

        <div className="flex items-center justify-center border-2 border-[#c7c6c6] bg-[#E7E7E7] rounded-3xl p-6 max-w-[720px] mx-auto">
          <div className="flex flex-wrap justify-around gap-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};


const StatusCard = ({ company, status, statusColor, iconColor }) => {
  return (
    <div className="flex items-center justify-center p-6 py-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition duration-300 border-2 border-[#c7c6c6] w-[320px]">
      <div className="text-left">
        <h2 className="text-xl font-semibold text-gray-800 text-center">{company}</h2>
        <p className={`mt-1 text-lg ${statusColor} flex items-center`}>
          <FaCircle
            className="h-4 w-4 shadow-custom-green rounded-full border-none"
            style={{ color: iconColor }}
          />
          <span className="mr-2 m-2">{status}</span>

        </p>
      </div>
    </div>
  );
};

export default MainContent;
