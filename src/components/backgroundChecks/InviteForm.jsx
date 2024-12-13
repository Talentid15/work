import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { BiCalendar } from "react-icons/bi";
import { FaRegFlag } from "react-icons/fa";

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  // Add more countries as needed
];

const InviteForm = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Invite candidates</h3>
        <FiX className="text-gray-600 text-xl cursor-pointer" />
      </div>
      <form className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">
          Enter Candidate Details
        </h4>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <input
          type="text"
          placeholder="Name"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <div className="flex gap-2">
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <select
              className="focus:outline-none text-sm"
              value={selectedCountry.code}
              onChange={(e) =>
                setSelectedCountry(
                  countryCodes.find((c) => c.code === e.target.value)
                )
              }
            >
              {countryCodes.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Mobile"
            className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <input
          type="text"
          placeholder="Staff / Employee ID"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <div className="flex items-center border border-gray-300 rounded-md p-2">
          <BiCalendar className="text-gray-500 text-sm mr-2" />
          <input
            type="date"
            className="w-full text-sm focus:outline-none"
          />
        </div>
        <div className="flex justify-between items-center">
          <textarea
            placeholder="Additional Details"
            className="w-full border border-gray-300 rounded-md p-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-purple-600"
          ></textarea>
          <button className="text-sm font-medium hover:underline ml-4">
            + Add Tags
          </button>
        </div>
        <div className="text-right">
          <button className="bg-[#652D96] text-white py-2 px-6 rounded-lg text-sm">
            Add to invite list
            
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteForm;
