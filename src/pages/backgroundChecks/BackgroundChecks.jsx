import React from "react";
import BackButton from "../../assets/backButton.png";
import ButtonGroup from "../../components/backgroundChecks/ButtonGroup";
// import AddUser from "../../components/backgroundChecks/AddUser";
import { Outlet } from "react-router-dom";

function BackgroundChecks() {
  return (
    <>
          <div className="flex flex-col flex-1 mt-6 px-6 font-poppins">
          <div className="">
            {/* Back Button and Heading */}
            <div className="flex items-center justify-between mb-4">
              {/* Back Button and Heading */}
              <div className="flex items-center">
                <button className="flex text-gray-600 hover:text-gray-800">
                  <img src={BackButton} alt="Back" className="w-6 h-6 mr-2" />
                </button>
                <h2 className="text-xl font-medium text-black-700">
                  Recent Searches
                </h2>
              </div>

              {/* Button Group */}
              <div className="flex">
                <ButtonGroup /> 
              </div>
            </div>

            <div className="flex flex-col items-center p-5">
                <Outlet />
            </div>
          </div>
        </div>
    </>
  );
}

export default BackgroundChecks;
