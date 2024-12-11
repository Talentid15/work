import React from "react";
import { Outlet } from "react-router-dom";

function OfferIntelligence() {
  return (
    <>
          <div className="flex flex-col flex-1 mt-6 px-6">
          {/* <div className=""> */}
            {/* Back Button and Heading */}
            {/* <div className="flex items-center justify-between mb-4"> */}
              {/* Back Button and Heading */}
              <div className="flex items-center">
                
                <Outlet />
                {/* <h2 className="text-lg font-semibold text-black-700">
                  Candidate List
                </h2> */}
              </div>
            {/* </div> */}

            {/* <div className="flex flex-col items-center p-5">
                
            </div> */}
          {/* </div> */}
        </div> 
    </>
  );
}

export default OfferIntelligence;
