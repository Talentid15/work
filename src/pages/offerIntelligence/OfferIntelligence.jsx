import { Outlet } from "react-router-dom";

function OfferIntelligence() {
  return (
    <>
          <div className="flex flex-col flex-1 mt-6 px-6">
    
              <div className="flex items-center">
                
                <Outlet />

              </div>
        </div> 
    </>
  );
}

export default OfferIntelligence;
