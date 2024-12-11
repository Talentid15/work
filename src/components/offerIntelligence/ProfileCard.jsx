import React from "react";
import photo from '../../assets/photo.png'

const ProfileCard = () => {
  return (
    <div className="bg-gray-200 rounded-lg m-4 flex">
      <img
        src={photo}
        alt="Soham"
        className="w-32 h-32 rounded-full mr-6"
      >
        </img>
      <div className="flex-1">
        <h3 className="text-2xl font-bold">Soham</h3>
        <p className="text-gray-500">📞 +91-1234567890</p>
        <p className="text-gray-500">📧 johndoe@example.com</p>
        <p className="text-gray-500">📍 Portland, Illinois</p>
      </div>
      {/* <div className="text-sm space-y-1 text-right">
        <p>
          Offer date: <span className="font-bold">October 25, 2019</span>
        </p>
        <p>
          Joining Date: <span className="font-bold">October 25, 2019</span>
        </p>
        <p>
          Status: <span className="text-green-600 font-bold">Available</span>
        </p>
        <button className="bg-black text-white px-4 py-2 rounded">View predictions</button>
      </div> */}
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-sm">
      {/* Offer and Joining Dates */}
      <div className="text-sm text-gray-800">
        <div className="flex justify-between mb-2">
          <span className="font-bold">Offer Date</span>
          <span>: October 25, 2019</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-bold">Joining Date</span>
          <span>: October 25, 2019</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Status</span>
          <span className="text-green-600 font-bold">: Available</span>
        </div>
      </div>

      {/* View Predictions Button */}
      <button className="bg-black text-white flex items-center justify-center gap-2 px-4 py-2 w-full rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.553-2.276A2 2 0 0018 6.117V4a2 2 0 10-4 0v2.117a2 2 0 01-1.553 1.607L8 10m7 0v4m0 0v2.5a2.5 2.5 0 01-5 0V14m5 0H8"
          />
        </svg>
        View Predictions
      </button>
    </div>
    </div>
  );
};

export default ProfileCard;
