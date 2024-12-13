import React from 'react'
import { LuMailPlus } from "react-icons/lu";

const AdditionalDetails = () => {
  return (
    <div className="flex items-center justify-between bg-white p-6 w-full mt-4 gap-4">
      <div>
        <input className="me-2" type="checkbox" />Send reminder
      </div>
      <input className="border-[#0000003D] border rounded p-2" type="date" />
    <div className="border-[#0000003D] border rounder p-2">
      <label for="packages">Select Packages / Checks:</label>      
      <select name="packages" id="packages" />
    </div>
      
      
      <button className="bg-[#652D96] text-white py-2 px-8 rounded-lg text-sm flex">
        <i className='mr-2 font-bold text-xl'><LuMailPlus /></i>
        Send invite    
      </button>
    </div>
  )
}

export default AdditionalDetails