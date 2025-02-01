import React from 'react'
import ButtonGroup from '../../components/Onboard/ButtonGrp'
import BackButton from "../../assets/backButton.png";
import { Outlet } from "react-router-dom";

const Onboarding = () => {
  return (
    <div className="flex flex-col flex-1   md:px-6 font-poppins w-full max-w-screen mx-auto  ">
      
    {/* Back Button and Heading */}
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
      <div className="flex items-center w-full md:w-auto">
        <button className="flex text-gray-600 hover:text-gray-800">
          <img src={BackButton} alt="Back" className="w-6 h-6 mr-2" />
        </button>
        <h2 className="text-lg md:text-xl font-medium text-black-700">
           Offered Packs
        </h2>
      </div>

      {/* Button Group */}
      <div className="w-full md:w-auto flex justify-end">
        <ButtonGroup />
      </div>
    </div>

    {/* Content Section */}
    <div className="flex flex-col items-center p-3 md:p-5 w-full">
      <Outlet />
    </div>
    
  </div>
  )
}

export default Onboarding