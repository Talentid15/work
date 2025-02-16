import React from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const Release_Offer = () => {
  const [step, setStep] = useState(1);
  return (
    <div>
      <div className=" h-[600px] overflow-auto no-scrollbar max-w-3xl mx-auto px-15 bg-white p-6  shadow-lg rounded-lg mt-10">
        {/* Stepper Navigation */}
        <div className="flex justify-between items-center mb-6 relative">
          {/* Step 1 - Offer Letter */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step === 1 ? "bg-purple-900" : "bg-gray-400"
              }`}
            >
              1
            </div>
            <p
              className={`text-sm ${
                step === 1 ? "text-purple-900 font-semibold" : "text-gray-500"
              }`}
            >
              Offer Letter
            </p>
          </div>

          {/* Line Connector */}
          <div className="absolute top-5 left-1/4 w-1/2 h-1 bg-gray-300"></div>
          <div
            className={`absolute top-5 left-1/4 w-1/2 h-1 transition-all ${
              step === 2 ? "bg-purple-900" : "bg-gray-300"
            }`}
          ></div>

          {/* Step 2 - Release Offer */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step === 2 ? "bg-purple-900" : "bg-gray-400"
              }`}
            >
              2
            </div>
            <p
              className={`text-sm ${
                step === 2 ? "text-purple-900 font-semibold" : "text-gray-500"
              }`}
            >
              Release Offer
            </p>
          </div>
        </div>

        {step === 1 ? (
          <div className=" w-full  p-6 ">
            <form className="w-[70%] mx-auto space-y-3">
              <div className="flex justify-center mt-2 mb-8">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="User"
                  className="w-[10rem] h-[10rem] rounded-full border-2 border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <label className="font-semibold text-gray-700">
                  Full Name of the Candidate
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border p-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <label className="font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Email of the candidate"
                  className="border p-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <label className="font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="border p-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <label className="font-semibold text-gray-700">Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  className="border p-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <label className="font-semibold text-gray-700">
                  Offer Expiry Date
                </label>
                <input
                  type="date"
                  placeholder="Expiry Date"
                  className="border p-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <label className="font-semibold text-gray-700">
                  Joining Date
                </label>
                <input
                  type="date"
                  placeholder="Joining Date"
                  className="border p-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Status
                </h3>
                <select className="w-[50%] px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700">
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </form>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-purple-700 text-white px-6 py-2 rounded-full mt-4"
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          // Release Offer Form
          <div className=" w-full  rounded-lg  p-6 ">
            <h2 className="text-lg font-medium text-center my-7">
              Please provide below Details
            </h2>

            <form className="w-[70%] mx-auto">
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-md font-semibold mb-2"
                  htmlFor="candidate-email"
                >
                  Candidate Email
                </label>
                <input
                  type="email"
                  id="candidate-email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Enter candidate email"
                />
              </div>

              {/* Email Subject */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-md font-semibold mb-2"
                  htmlFor="email-subject"
                >
                  Email Subject
                </label>
                <input
                  type="text"
                  id="email-subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700"
                  placeholder="Enter email subject"
                />
              </div>

              {/* Email Message */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-md font-semibold mb-2"
                  htmlFor="email-message"
                >
                  Email Message
                </label>
                <textarea
                  id="email-message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows="5"
                  placeholder="Enter email message"
                ></textarea>
              </div>

              {/* Upload Offer Letter */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-md font-semibold mb-2"
                  htmlFor="offer-letter"
                >
                  Upload Offer Letter
                </label>
                <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input type="file" id="offer-letter" className="hidden" />
                  <label
                    htmlFor="offer-letter"
                    className="text-purple-600 cursor-pointer hover:text-purple-700"
                  >
                    Click to upload
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-5 mt-8">
                <button
                  className="bg-gray-500 text-white px-5 py-2 rounded-full shadow hover:bg-gray-700 transition-all"
                  onClick={() => setStep(1)} // Go back to Offer Letter
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300"
                >
                  Release
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center items-center p-3 md:p-5 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Release_Offer;
