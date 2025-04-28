import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { MdOutlineSettings } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { BiSolidCheckShield } from "react-icons/bi";
import { SiLens } from "react-icons/si";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { GiBackwardTime } from "react-icons/gi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isJobOffersOpen, setIsJobOffersOpen] = useState(false);
  const [selectedNav, setSelectedNav] = useState("Dashboard");
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleJobOffers = () => {
    setIsJobOffersOpen(!isJobOffersOpen);
  };

  return (
    <div className="h-screen overflow-hidden flex fixed">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 text-black text-2xl md:hidden z-50 bg-white rounded-full p-2 shadow-md"
      >
        {isOpen ? (
          <AiOutlineClose className="text-purple-700 hover:scale-110 transition-all" />
        ) : (
          <AiOutlineMenu className="text-purple-700 hover:scale-110 transition-all" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 h-full sm:w-64 lg:w-72 bg-gradient-to-br from-[#74449D] to-[#4B2775] text-white shadow-xl transform transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 rounded-r-xl flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="">
          <h1 className="flex items-center justify-center pb-5 pt-10 border-b border-purple-400/30 text-xl font-bold text-center">
            {selectedNav}
          </h1>

          {/* Navigation */}
          <nav className="mt-6 px-3 space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-3 px-4 py-3 bg-white/20 rounded-xl text-white font-medium shadow-md"
                  : "flex items-center space-x-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-all duration-200"
              }
              onClick={() => setSelectedNav("Dashboard")}
            >
              <MdDashboard className="h-5 w-5" />
              <span className="text-sm">Dashboard</span>
            </NavLink>

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-3 px-4 py-3 bg-white/20 rounded-xl text-white font-medium shadow-md"
                  : "flex items-center space-x-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-all duration-200"
              }
              onClick={() => setSelectedNav("Candidate Search")}
            >
              <BiSolidCheckShield className="h-5 w-5" />
              <span className="text-sm">Candidate Search</span>
            </NavLink>

            <div className="rounded-xl overflow-hidden transition-all duration-300">
              <div
                onClick={() => {
                  toggleJobOffers();
                  setSelectedNav("Job Offers");
                }}
                className={
                  isJobOffersOpen ||
                  location.pathname === "/joboffers" ||
                  location.pathname === "/offer-punch"
                    ? "flex items-center justify-between px-4 py-3 bg-white/20 text-white font-medium cursor-pointer"
                    : "flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                }
              >
                <div className="flex items-center space-x-3">
                  <BiEdit className="h-5 w-5" />
                  <span className="text-sm">Job Offers</span>
                </div>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    isJobOffersOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Sub-options for Job Offers */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isJobOffersOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink
                  to="/joboffers"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center pl-12 pr-4 py-3 bg-white/15 border-l-2 border-white text-white"
                      : "flex items-center pl-12 pr-4 py-3 hover:bg-white/5 border-l-2 border-transparent hover:border-purple-300/50 transition-all duration-200"
                  }
                  onClick={() => setSelectedNav("Release Offers")}
                >
                  <BiEdit className="h-4 w-4 mr-3" />
                  <span className="text-sm">Release Offers</span>
                </NavLink>
                <NavLink
                  to="/offer-punch"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center pl-12 pr-4 py-3 bg-white/15 border-l-2 border-white text-white"
                      : "flex items-center pl-12 pr-4 py-3 hover:bg-white/5 border-l-2 border-transparent hover:border-purple-300/50 transition-all duration-200"
                  }
                  onClick={() => setSelectedNav("Offer Punch")}
                >
                  <BiEdit className="h-4 w-4 mr-3" />
                  <span className="text-sm">Offer Punch</span>
                </NavLink>
              </div>
            </div>

            <NavLink
              to="/offerIntelligence"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-3 px-4 py-3 bg-white/20 rounded-xl text-white font-medium shadow-md"
                  : "flex items-center space-x-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-all duration-200"
              }
              onClick={() => setSelectedNav("Offer Intelligence")}
            >
              <SiLens className="h-5 w-5" />
              <span className="text-sm">Offer Lens</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 pb-20 space-y-3 mt-auto">
          {/* Support Button */}
          <Link
            to="https://talentid.tawk.help/"
            target="_blank"
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200"
          >
            <GiBackwardTime className="h-5 w-5" />
            <span className="text-sm">Support</span>
          </Link>

          {/* Settings Button */}
          <Link
            to="/settings"
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-purple-700 rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-md"
            onClick={() => setSelectedNav("Settings")}
          >
            <MdOutlineSettings className="h-5 w-5" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;