// components/ProfileCard.js
import React from 'react';
import { BsUpload } from "react-icons/bs";
import { MdOutlineRemoveRedEye } from "react-icons/md";


const ProfileUpdateCard = () => {
  return (
    <div className="rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-800">Enter the name</h2>
          <p className="text-sm text-gray-500">Phone number</p>
          <p className="text-sm text-gray-500">Email address</p>
          <p className="text-sm text-gray-500">Address</p>
        </div>
        {/* <div className="space-y-2 text-right">
          <p className="text-sm text-gray-500"><span className="font-semibold">Offer date:</span> Enter the date</p>
          <p className="text-sm text-gray-500"><span className="font-semibold">Joining Date:</span> Enter the date</p>
          <p className="text-sm text-gray-500"><span className="font-semibold">Status:</span> Enter status</p>
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">View predictions</button>
        </div> */}


<div className="bg-white shadow rounded-lg p-6 w-full max-w-sm">
      {/* Offer and Joining Dates */}
      <div className="text-sm text-gray-800">
        <div className="flex justify-between mb-2">
          <span className="font-bold">Offer Date</span>
          <span>: Enter the date</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-bold">Joining Date</span>
          <span>: Enter the date</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Status</span>
          <span>: Enter status</span>
        </div>
      </div>
       {/* View Predictions Button */}
       <button className="bg-black text-white flex items-center justify-center gap-2 px-4 py-2 w-full rounded">
       <i className="text-xl"><MdOutlineRemoveRedEye />
        </i>
        View Predictions
      </button>
      </div>


        
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
      <button className="px-6 py-3 bg-gray-200 rounded hover:bg-gray-300 flex">
        <i className="mt-1 mr-2">
      <BsUpload />
      </i>
          Upload Resume
        </button>
      <div className="mt-8 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Experience summary</h3>
          <textarea
            className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="About their work experience..."
          ></textarea>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Education summary</h3>
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Degree Eg: BA, BBA, BE, BTECH..."
          />
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="College..."
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Engagement preference</h3>
          <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
            +
          </button>
        </div>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-3xl hover:bg-purple-800">
          Start Engagement
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateCard;
