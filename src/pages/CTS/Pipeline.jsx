import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { MdSearch } from "react-icons/md";
import StepProgress from "../../components/CTS/Temp";
import { IoChevronBack } from "react-icons/io5";
import { HiOutlineUsers } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { FaFileCircleQuestion } from "react-icons/fa6";

function Pipeline({ user }) {
  const navigate = useNavigate();

  const roundNames = [
    "Screening Round",
    "Round 1",
    "Round 2",
    "Technical Round",
    "Culture Round",
    "HR & Final Round",
  ];

  const recommended_status = ["hire"];

  return (
    <div className=" flex flex-col  p-5 bg-white w-full ">
      {/* Header */}
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

      {/* Title */}
      <div className="flex flex-col items-center p-4 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 ">
          Track Candidate Status
        </h1>

        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 w-full max-w-2xl">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Enter email address or phone number"
              className="w-full p-4 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
            />
            <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
          </div>
          <button className="w-full lg:w-auto px-6 py-3 bg-[#803CD8] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition duration-200">
            Check Status
          </button>
        </div>
      </div>

      {/* Pipeline Section */}
      <div className="bg-[#E8DEF8] flex items-center justify-center flex-col rounded-3xl border border-gray-300 p-4 lg:p-12 m-9">
        <div className="mb-8 ">
          <button
            className="flex items-center gap-2 bg-purple-700 text-white font-bold border border-gray-300 rounded-3xl px-6 py-3 shadow-2xl hover:scale-105 hover:bg-gray-100 hover:text-black transition duration-200"
            onClick={() => navigate(-1)}
          >
            <IoChevronBack className="text-gray-400" />
            Jainayak's Profile
          </button>
        </div>

        {/* Company Name */}
        <div className="text-center mb-6 w-full">
          <h2 className="font-bold text-4xl">Infosys</h2>
        </div>

        {/* Step Progress */}
        <div className="relative w-full flex flex-col items-center">
          <StepProgress
            roundName={roundNames}
            recommended_status={recommended_status}
          />
        </div>

        {/* Check Another */}
        <div className="flex justify-center lg:justify-center mt-20">
          <button className="flex  mr-8 items-center gap-2 bg-purple-900  text-white px-6 py-3 rounded-full  hover:bg-purple-400 hover:text-black transition duration-300">
            Back
          </button>
          <button className="flex items-center gap-2 bg-white border-purple-900 text-black px-6 py-3 rounded-full  hover:bg-purple-900 hover:text-white transition duration-300">
            <MdSearch className="h-6 w-6" />
            Check Another Candidate
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pipeline;
