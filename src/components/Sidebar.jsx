import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineSettings } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi";
import { TbFileStack, TbFlagBolt, TbUserCheck } from "react-icons/tb";

const Sidebar = () => {
  return (
    <div className="bg-gradient-to-b from-[#74449D] to-[#4B2775] text-white w-full md:w-[300px] min-h-screen flex flex-col justify-between shadow-lg">
      {/* Header */}
      <div className="relative">
        <h1 className="text-2xl font-bold text-center py-6 border-b border-purple-400">
          Candidate Tracker
        </h1>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-4 px-4 py-3 bg-purple-600 rounded-lg shadow-md"
                : "flex items-center space-x-4 px-4 py-3 hover:bg-purple-700 rounded-lg transition-all duration-200"
            }
          >
            <TbFlagBolt className="h-6 w-6" />
            <span className="text-sm font-medium">Candidate Tracking</span>
          </NavLink>

          <NavLink
            to="/backgroundchecks"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-4 px-4 py-3 bg-purple-600 rounded-lg shadow-md"
                : "flex items-center space-x-4 px-4 py-3 hover:bg-purple-700 rounded-lg transition-all duration-200"
            }
          >
            <TbUserCheck className="h-6 w-6" />
            <span className="text-sm font-medium">Background Checks</span>
          </NavLink>

          <NavLink
            to="/offerIntelligence"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-4 px-4 py-3 bg-purple-600 rounded-lg shadow-md"
                : "flex items-center space-x-4 px-4 py-3 hover:bg-purple-700 rounded-lg transition-all duration-200"
            }
          >
            <TbFileStack className="h-6 w-6" />
            <span className="text-sm font-medium">Offer Lens</span>
          </NavLink>

          <NavLink
            to="/onboarding"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-4 px-4 py-3 bg-purple-600 rounded-lg shadow-md"
                : "flex items-center space-x-4 px-4 py-3 hover:bg-purple-700 rounded-lg transition-all duration-200"
            }
          >
            <TbFileStack className="h-6 w-6" />
            <span className="text-sm font-medium">Onboarding</span>
          </NavLink>

          <NavLink
            to="/assetManagement"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-4 px-4 py-3 bg-purple-600 rounded-lg shadow-md"
                : "flex items-center space-x-4 px-4 py-3 hover:bg-purple-700 rounded-lg transition-all duration-200"
            }
          >
            <TbFileStack className="h-6 w-6" />
            <span className="text-sm font-medium">Asset Management</span>
          </NavLink>

          <NavLink
            to="/performanceManagement"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-4 px-4 py-3 bg-purple-600 rounded-lg shadow-md"
                : "flex items-center space-x-4 px-4 py-3 hover:bg-purple-700 rounded-lg transition-all duration-200"
            }
          >
            <TbFileStack className="h-6 w-6" />
            <span className="text-sm font-medium">Performance Management</span>
          </NavLink>

          <NavLink
            to="/offboarding"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-4 px-4 py-3 bg-purple-600 rounded-lg shadow-md"
                : "flex items-center space-x-4 px-4 py-3 hover:bg-purple-700 rounded-lg transition-all duration-200"
            }
          >
            <TbFileStack className="h-6 w-6" />
            <span className="text-sm font-medium">Offboarding</span>
          </NavLink>
        </nav>
      </div>

      {/* Footer Buttons */}
      <div className="px-4 pb-4 space-y-4 mb-16">
        <button className="w-full flex items-center space-x-4 px-4 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-purple-500 transition-all duration-200">
          <GiBackwardTime className="h-5 w-5" />
          <span className="text-sm font-medium">Support</span>
        </button>

        <button className="w-full flex items-center space-x-4 px-4 py-3 bg-white text-purple-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
          <MdOutlineSettings className="h-5 w-5" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
