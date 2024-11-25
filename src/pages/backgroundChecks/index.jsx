import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import BackButton from "../../assets/backButton.png";
import ButtonGroup from "../../components/backgroundChecks/ButtonGroup";
// import AddUser from "../../components/backgroundChecks/AddUser";
import { Outlet } from "react-router-dom";

function BackgroundChecks() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex justify-between items-start mt-6 px-6 flex-row">
            {/* Back Button and Heading */}
            <div className="flex items-center">
              <button className="flex text-gray-600 hover:text-gray-800">
                <img src={BackButton} alt="Back" className="w-6 h-6 mr-2" />
              </button>
              <h2 className="text-lg text-black-700">Recent Searches</h2>
            </div>

            {/* Button Group */}
            <div className="ml-80">
              <ButtonGroup />
            </div>
          </div>
          <div className="">
          <Outlet />
          </div>

        </div>

      </div>
    </>
  );
}

export default BackgroundChecks;
