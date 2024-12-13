// components/ProfileCard.js
import React from "react";
import { BsUpload } from "react-icons/bs";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";

const ProfileUpdateCard = () => {
  return (
    <div className="bg-[#EEEEEE] rounded shadow mt-6 p-4 w-full mx-auto">
      <div className="flex items-center space-x-6">
        {/* <div className="w-24 h-24 bg-gray-300 rounded-full"></div> */}
        <div className="w-24 h-24 bg-gray-300 rounded-full relative overflow-hidden flex items-center justify-center cursor-pointer">
          <label
            htmlFor="photoInput"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-sm text-gray-500">+ Upload</span>
          </label>
          <input
            type="file"
            id="photoInput"
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-[#818181]">
            <input
              type="text"
              placeholder="Enter the name"
              className="bg-transparent outline-none text-[#818181] w-full"
            />
          </h2>
          <div className="w-1/2 h-[1px] bg-[#818181] my-2"></div>
          <hr className="text-black" />
          <p className="flex gap-1 text-sm text-[#818181]">
            <MdOutlineLocalPhone className="text-black mt-1" />
            <input
              type="text"
              placeholder="Phone number"
              className="bg-transparent outline-none text-[#818181] w-full"
            />
          </p>
          <p className="flex gap-1 text-sm text-[#818181]">
            <MdOutlineMail className="text-black mt-1" />
            <input
              type="text"
              placeholder="Email address"
              className="bg-transparent outline-none text-[#818181] w-full"
            />
          </p>
          <p className="flex gap-1 text-sm text-[#818181]">
            <MdOutlineLocationOn className="text-black mt-1" />
            <input
              type="text"
              placeholder="Address"
              className="bg-transparent outline-none text-[#818181] w-full"
            />
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 w-[290px] mb-5">
          {/* Offer and Joining Dates */}
          <div className="text-sm text-gray-800">
            <div className="flex mb-2 gap-2">
              <span className="font-bold">Offer Date :</span>
              <input
                type="text"
                className="bg-transparent outline-none text-gray-600"
                placeholder="Enter the date"
              />
            </div>
            <div className="w-1/2 h-[1px] bg-gray-200 my-2 ml-20"></div>

            <div className="flex mb-2 gap-2">
              <span className="font-bold">Joining Date :</span>
              <input
                type="text"
                className="bg-transparent outline-none text-gray-600"
                placeholder="Enter the date"
              />
            </div>
            <div className="w-1/2 h-[1px] bg-gray-200 my-2 ml-20"></div>

            <div className="flex mb-2 gap-2">
              <span className="font-bold">Status :</span>
              <input
                type="text"
                className="bg-transparent outline-none text-gray-600"
                placeholder="Enter status"
              />
            </div>
            <div className="w-1/2 h-[1px] bg-gray-200 my-2 ml-10 mb-5"></div>
          </div>
          {/* View Predictions Button */}
          <button className="bg-black text-white flex items-center justify-center gap-2 px-4 py-2 w-full rounded">
            <i className="text-xl">
              <MdOutlineRemoveRedEye />
            </i>
            View Predictions
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Experience summary
            </h3>
            <input
              type="text"
              className="w-[300px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="About their work experience..."
            />
          </div>
          <button className="h-[40px] px-2 py-2 bg-[#EEEEEE] rounded hover:bg-gray-300 flex">
            <i className="mt-1 mr-2">
              <BsUpload />
            </i>
            Upload resume
          </button>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Education summary
            </h3>
            <input
              type="text"
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Degree Eg: BA, BBA, BE, BTECH..."
            />
            <input
              type="text"
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="College..."
            />
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Engagement preference
            </h3>
            <button className="w-10 mt-2 h-8 bg-white border border-black rounded flex items-center justify-center hover:bg-gray-300">
              +
            </button>
          </div>
          <button className="px-4 py-2 bg-[#652D96] text-white rounded-3xl hover:bg-purple-800">
            Start Engagement
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateCard;
