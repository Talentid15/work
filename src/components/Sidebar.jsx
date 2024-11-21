import React from "react";
import offerIcon from "../assets/offerIcon.png";
import dashboardIcon from "../assets/dashboard.png";
import trackingIcon from "../assets/tracking.png";
import backgroundIcon from "../assets/background.png";
import onboardingIcon from "../assets/onboarding.png";
import assetIcon from "../assets/asset.png";
import performanceIcon from "../assets/performance.png";
import offboardingIcon from "../assets/offboarding.png";
import supportIcon from "../assets/support.png";
import settingsIcon from "../assets/settings.png";

const Sidebar = () => {
  return (
    <div className="bg-[#652D96] text-white w-64 space-y-6">
      
      <nav className="space-y-4 mb-24 mt-2">
        
        {/* <a
          href="#"
          className="flex items-center space-x-3 p-2 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={dashboardIcon} alt="Dashboard" className="h-6 w-6" />
          <span>Dashboard</span>
        </a> */}

        <a
          href="#"
          className="flex items-center space-x-3 p-2 bg-white text-black hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={trackingIcon} alt="Tracking" className="h-6 w-6" />
          <span>Candidate tracking system</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 p-2 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={backgroundIcon} alt="Background" className="h-6 w-6" />
          <span>Background checks</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 p-2 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={offerIcon} alt="Offer Intelligence" className="h-6 w-6" />
          <span>Offer intelligence</span>
        </a>

        {/* <a
          href="#"
          className="flex items-center space-x-3 p-2 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={onboardingIcon} alt="Onboarding" className="h-6 w-6" />
          <span>Onboarding</span>
        </a> */}

        {/* <a
          href="#"
          className="flex items-center space-x-3 p-2 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={assetIcon} alt="Asset Management" className="h-6 w-6" />
          <span>Asset Management</span>
        </a> */}

        {/* <a
          href="#"
          className="flex items-center space-x-3 p-2 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={performanceIcon} alt="Performance" className="h-6 w-6" />
          <span>Performance Management</span>
        </a> */}


        {/* <a
          href="#"
          className="flex items-center space-x-3 p-2 hover:bg-purple-300 active:bg-purple-300 active:text-black"
        >
          <img src={offboardingIcon} alt="Offboarding" className="h-6 w-6" />
          <span>Offboarding</span>
        </a> */}
      </nav>

      <div className="mt-auto mx-4">

        <button className="w-full flex items-center space-x-3 p-2 rounded-full bg-purple-700 hover:bg-purple-800 active:bg-white active:text-black">
          <img src={supportIcon} alt="Support" className="h-6 w-6" />
          <span>Support</span>
        </button>

        <button className="w-full flex items-center space-x-3 p-2 mt-2 rounded-full bg-white text-black hover:bg-purple-800 active:bg-white active:text-black">
          <img src={settingsIcon} alt="Settings" className="h-6 w-6" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
