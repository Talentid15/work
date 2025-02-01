import React, { useState } from "react";
import axios from "axios";
import { MdEmail } from "react-icons/md";

import toast from "react-hot-toast";

const ChangePassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentpass: "",
    newpassword: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/settings",
        formData
      );

      console.log("Response Data:", response.data);
      alert("Password changed successfully!");

      setFormData({
        currentpass: "",
        newpassword: "",
        confirmpassword: "",
      });
    } catch (error) {
      console.error("Error", error);
      alert("Error saving profile, please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-[600px] min-h-[70vh] bg-white shadow-xl rounded-2xl p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6 text-center sm:text-left">
          Password Change
        </h2>

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center space-x-4">
            <img
              src="https://via.placeholder.com/50"
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-purple-400"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center border-b pb-1 sm:space-x-2">
                <h2 className="text-xl font-semibold">Jai Nayak</h2>
              </div>
              <p className="text-sm text-gray-600 flex items-center justify-center sm:justify-start mt-2">
                <MdEmail className="mr-1" /> Jai@talentid.app
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full flex flex-wrap gap-8">
            {/* Inputs */}
            {[
              { label: "Current Password", name: "currentpass", type: "password" },
              { label: "New Password", name: "newpassword", type: "password" },
              { label: "Confirm New Password", name: "confirmpassword", type: "password" },
            ].map((input) => (
              <div className="relative w-[70%]" key={input.name}>
                <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                  {input.label}
                </label>
                <input
                  type={input.type}
                  name={input.name}
                  value={formData[input.name]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:justify-start">
            <button
              type="submit"
              className="bg-purple-900 text-white py-2 px-6 rounded-full shadow-md hover:bg-purple-300 hover:text-black transition-all"
            >
              Continue
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 px-6 py-2 rounded-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
