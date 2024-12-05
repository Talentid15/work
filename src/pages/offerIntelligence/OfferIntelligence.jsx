import React from "react";
import BackButton from "../../assets/backButton.png";
import { Outlet } from "react-router-dom";

function OfferIntelligence() {
  return (
    <>
          <div className="flex flex-col flex-1 mt-6 px-6">
          <div className="">
            {/* Back Button and Heading */}
            <div className="flex items-center justify-between mb-4">
              {/* Back Button and Heading */}
              <div className="flex items-center">
                <button className="flex text-gray-600 hover:text-gray-800">
                  <img src={BackButton} alt="Back" className="w-6 h-6 mr-2" />
                </button>
                <h2 className="text-lg font-semibold text-black-700">
                  Candidate List
                </h2>
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

export default OfferIntelligence;
