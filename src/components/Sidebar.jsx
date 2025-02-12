import React, { useState } from "react";
import { NavLink,Link } from "react-router-dom";
import { MdOutlineSettings } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi";
import { TbFileStack, TbFlagBolt, TbUserCheck } from "react-icons/tb";
import { CgPerformance } from "react-icons/cg";
import { PiMagnifyingGlassFill } from "react-icons/pi";
import { FaSuperpowers } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa"; // Icon for Candidate Tracking

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCandidateTrackingOpen, setIsCandidateTrackingOpen] = useState(false);

  const [selectedNav, setSelectedNav] = useState("Candidate Tracking");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCandidateTracking = () => {
    setIsCandidateTrackingOpen(!isCandidateTrackingOpen);
  };

  return (
    <div className="relative h-screen flex lg: ">
      {/* Menu Icon */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 text-black text-2xl md:hidden z-50"
      >
        {isOpen ? (
          <AiOutlineClose className="hover:scale-105 transition-all" />
        ) : (
          <AiOutlineMenu className="hover:scale-105 transition-all" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full sm:w-[70%]  lg:w-90   bg-gradient-to-b from-[#74449D] to-[#4B2775] text-white shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full "
        } md:relative md:translate-x-0 lg:w-80   `}
      >
        {/* Header */}
        <div >
        <h1 className="text-2xl font-bold text-center py-4 lg:border-b border-purple-400 mt-1">
        {selectedNav}
        </h1>

          {/* Navigation */}
          <nav className="mt-4 space-y-3 sm:space-y-0 sm:mt-[1px]  ">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-6 bg-purple-400  shadow-md "
                  : "flex items-center space-x-4 px-4 py-6 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
              onClick={() => setSelectedNav("Dashboard")}
            >
                <TbFlagBolt className="h-6 w-6" />
                <span className="text-sm font-medium">Dashboard</span>
           </NavLink>

            <div>
              <NavLink
                to="/"
                onClick={() => {
                  toggleCandidateTracking(); // Call your first function
                  setSelectedNav("Candidate Tracker"); // Call your second function
                }}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center space-x-4 pl-4 py-6 bg-purple-400 shadow-md"
                    : "flex items-center space-x-4 pl-4 py-6 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
                }
                
              >
                <button
                  className="w-full flex items-center justify-center font-semibold "
                  onClick={() =>
                    setIsCandidateTrackingOpen(!isCandidateTrackingOpen)
                  }
                >
                  <FaChartLine className="h-5 w-5" />
                  <span className="text-sm font-medium mr-3 ml-3">
                    Candidate tracking system
                  </span>
                  <FaChevronDown
                    className={`transition-transform ${
                      isCandidateTrackingOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </NavLink>

              {/* Sub-options for Candidate Tracking */}
              {isCandidateTrackingOpen && (
                <div className=" w-full flex flex-col items-center ">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "w-full flex items-center justify-center space-x-4 pl-4 py-3 pr-5 bg-purple-300 shadow-md"
                      : "w-full flex items-center justify-center space-x-4 pl-4 py-3 pr-5 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
                  }
                >
                  <span className="text-center">Interview</span>
                </NavLink>
                <NavLink
                  to="/offer-punch"
                  className={({ isActive }) =>
                    isActive
                      ? "w-full flex items-center justify-center space-x-4 pl-4 py-3 pr-5 bg-purple-300 shadow-md"
                      : "w-full flex items-center justify-center space-x-4 pl-4 py-3 pr-5 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
                  }
                >
                  <span className="text-center">Offer Punch</span>
                </NavLink>
              </div>
              
              )}
            </div>

            {/* <NavLink
              to="/backgroundchecks"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "sm: flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
              }
            >
              <TbUserCheck className="h-6 w-6" />
              <span className="text-sm font-medium">Background Checks</span>
            </NavLink> */}
            <NavLink
              to="/joboffers"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-6 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-6 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
              onClick={() => setSelectedNav("Job Offers")}
            >
              <PiMagnifyingGlassFill className="h-6 w-6" />
              <span className="text-sm font-medium">Job Offers</span>
            </NavLink>

            <NavLink
              to="/offerIntelligence"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-6 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-6 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
              onClick={() => setSelectedNav("Offer Intelligence")}
            >
              <PiMagnifyingGlassFill className="h-6 w-6" />
              <span className="text-sm font-medium">Offer Intelligence</span>
            </NavLink>
            {/* <NavLink
              to="/onboarding"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
            >
              <TbFileStack className="h-6 w-6" />
              <span className="text-sm font-medium">Onboarding</span>
            </NavLink> */}
            {/* <NavLink
              to="/assetManagement"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
            >
              <FaSuperpowers className="h-6 w-6" />
              <span className="text-sm font-medium">Asset Management</span>
            </NavLink>
            <NavLink
              to="/performanceManagement"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
              }
            >
              <CgPerformance className="h-6 w-6" />
              <span className="text-sm font-medium">
                Performance Management
              </span>
            </NavLink> */}
            {/* <NavLink
              to="/offboarding"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
            >
              <TbFileStack className="h-6 w-6" />
              <span className="text-sm font-medium">Offboarding</span>
            </NavLink> */}
          </nav>
        </div>

        {/* Footer Buttons */}
        <div className=" px-4 pb-4 space-y-4 mt-28 ">
 {/* Support Button */}
    <Link 
        to="/support" 
        className="w-full flex items-center space-x-4 px-4 py-3 bg-transparent border border-white text-white rounded-full hover:bg-purple-300 hover:border-purple-500 hover:text-black transition-all duration-200"
      >
        <GiBackwardTime className="h-5 w-5" />
        <span className="text-sm font-medium">Support</span>
      </Link>

      {/* Settings Button */}
      <Link 
        to="/settings" 
        className="w-full flex items-center space-x-4 px-4 py-3 bg-white text-purple-700 rounded-full hover:bg-gray-100 transition-all duration-200"
      >
        <MdOutlineSettings className="h-5 w-5" />
        <span className="text-sm font-medium">Settings</span>
      </Link>
        </div>
      </div>

      {/* Content Overlay for smaller screens */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
