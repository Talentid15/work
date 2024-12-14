import React from "react";
// import offerIcon from "../assets/offerIcon.png";
// import dashboardIcon from "../assets/dashboard.png";
// import trackingIcon from "../assets/tracking.png";
// import backgroundIcon from "../assets/background.png";
// import onboardingIcon from "../assets/onboarding.png";
// import assetIcon from "../assets/asset.png";
// import performanceIcon from "../assets/performance.png";
// import offboardingIcon from "../assets/offboarding.png";
// import supportIcon from "../assets/support.png";
// import settingsIcon from "../assets/settings.png";
import { NavLink } from "react-router-dom";
import { MdOutlineSettings } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi"
import { TbFileStack, TbFlagBolt, TbUserCheck } from "react-icons/tb"

const Sidebar = () => {
  return (
    <div className="bg-[#652D96] text-white w-[280px] flex flex-col justify-between">

      <nav className="pb-24">

        <NavLink
          to="/"
          className={({ isActive }) => isActive ? "flex items-center bg-[#E8DEF8] space-x-3 p-5 hover:bg-purple-300 active:bg-purple-300 text-black"
            : "border-b-white flex items-center bg-[#74449D] space-x-3 p-5 hover:bg-purple-800 active:text-black"
          }
        >
          <TbFlagBolt className="h-6 w-6" />
          {/* <img src={trackingIcon} alt="Tracking" className="h-6 w-6 color-white" /> */}
          <span>Candidate tracking system</span>
        </NavLink>

        <NavLink
          to="/backgroundchecks"
          className={({ isActive }) => isActive ? "flex items-center bg-[#E8DEF8] space-x-3 p-5 hover:bg-purple-300 active:bg-purple-300 text-black"
            : "flex items-center bg-[#74449D] space-x-3 p-5 hover:bg-purple-800 active:text-black"
          }
        >
          <TbUserCheck className="h-6 w-6" />
          {/* <img src={backgroundIcon} alt="Background" className="h-6 w-6" /> */}
          <span>Background checks</span>
        </NavLink>

        <NavLink
          to="/offerIntelligence"
          className={({ isActive }) => isActive ? "flex items-center bg-[#E8DEF8] space-x-3 p-5 hover:bg-purple-300 active:bg-purple-300 text-black"
            : "flex items-center bg-[#74449D] space-x-3 p-5 hover:bg-purple-800 active:text-black"
          }
        >
          <TbFileStack className="h-6 w-6" />
          {/* <img src={offerIcon} alt="Offer Intelligence" className="h-6 w-6" /> */}
          <span>Offer Lens</span>
        </NavLink>

        {/* <a
          href="#"
          className="flex items-center space-x-3 p-3 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={onboardingIcon} alt="Onboarding" className="h-6 w-6" />
          <span>Onboarding</span>
        </a> */}

        {/* <a
          href="#"
          className="flex items-center space-x-3 p-3 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={assetIcon} alt="Asset Management" className="h-6 w-6" />
          <span>Asset Management</span>
        </a> */}

        {/* <a
          href="#"
          className="flex items-center space-x-3 p-3 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={performanceIcon} alt="Performance" className="h-6 w-6" />
          <span>Performance Management</span>
        </a> */}


        {/* <a
          href="#"
          className="flex items-center space-x-3 p-3 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={offboardingIcon} alt="Offboarding" className="h-6 w-6" />
          <span>Offboarding</span>
        </a> */}
      </nav>

      <div className="mx-4 mb-4">
        <button className="w-full flex items-center space-x-3 p-3 rounded-full border-white border-2 bg-transparent hover:bg-white hover:text-black active:bg-white active:text-black">
          <GiBackwardTime className="h-6 w-6" />
          {/* <img src={supportIcon} alt="Support" className="h-6 w-6" /> */}
          <span>Support</span>
        </button>

        <button className="w-full flex items-center space-x-3 p-3 mt-2 rounded-full border-white border-2 bg-transparent text-white hover:bg-white hover:text-black active:bg-white active:text-black">

          <MdOutlineSettings className="h-6 w-6" />

          {/* <img src={settingsIcon} alt="Settings" className="h-6 w-6" /> */}
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
