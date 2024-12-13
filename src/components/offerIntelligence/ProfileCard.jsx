import React from "react";
import photo from '../../assets/photo.png'
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { NavLink } from "react-router-dom";

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
      <NavLink to="/offerIntelligence/prediction">
      <button className="bg-black text-white flex items-center justify-center gap-2 px-4 py-2 w-full rounded">
      <i className="text-xl"><MdOutlineRemoveRedEye />
        </i>
        View Predictions
      </button>
      </NavLink>
    </div>
    </div>
  );
};

export default ProfileCard;
