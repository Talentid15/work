import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import axios from "axios";

import {dateDifference} from "../../utils/index";

const ReleaseOffer = () => {
  const data = useSelector((state) => state.user.data);

  console.log("data is ", data);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: "",
    joiningDate: "",
    expiryDate: "",
    emailSubject: "",
    emailMessage: "",
    candidateEmail: "",
    candidateName: "",
    candidatePhoneNo: "",
    companyName: data.company,
    offerLetter: null,
    candidateResume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if(e.target.name === "expiryDate" && formData.joiningDate === ""){

      
      toast.error("Please Enter the Joining Date First ");

      return ;

  }

    setFormData((prev) => ({ ...prev, [name]: value }));


  };

  const handleFileChange = (e) => {


    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));

    
  };

  const formSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      console.log("form data is ", formData);

      const resposne = await axios.post("/")

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 bg-white p-8 shadow-xl rounded-xl mt-10 border border-gray-200">
      {/* Stepper Navigation */}
      <div className="flex justify-between items-center mb-8 relative">
        {["Offer Details", "Release Offer"].map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-lg font-semibold transition-all duration-300 ${
                step === index + 1 ? "bg-indigo-600" : "bg-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`text-sm mt-2 font-medium ${
                step === index + 1 ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
        <div
          className={`absolute top-6 left-1/4 w-1/2 h-1 ${
            step === 2 ? "bg-indigo-600" : "bg-gray-300"
          }`}
        ></div>
      </div>

      {/* Step 1 - Offer Details */}
      {step === 1 && (
        <form className="w-full space-y-5">
          {[
            "jobTitle",
            "candidateName",
            "candidateEmail",
            "candidatePhoneNo",
            "companyName",
            "joiningDate",
            "expiryDate",
          ].map((name, index) => (
            <div key={index}>
              <label className="font-semibold text-gray-700 capitalize">
                {name.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={name.includes("Date") ? "date" : "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  name === "hrId" || name === "companyName"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                readOnly={name === "hrId" || name === "companyName"}
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 2 - Release Offer */}
      {step === 2 && (
        <form className="w-full space-y-5">
          {["emailSubject", "emailMessage"].map((name, index) => (
            <div key={index}>
              <label className="font-semibold text-gray-700 capitalize">
                {name.replace(/([A-Z])/g, " $1")}
              </label>
              {name === "emailMessage" ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="5"
                ></textarea>
              ) : (
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}

          {["candidateResume", "offerLetter"].map((name, index) => (
            <div key={index}>
              <label className="font-semibold text-gray-700 capitalize">
                Upload {name.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="file"
                name={name}
                onChange={handleFileChange}
                className="w-full border rounded-lg p-3"
              />
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              type="submit"
              onClick={formSubmitHandler}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Release Offer
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col justify-center items-center p-3 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default ReleaseOffer;
