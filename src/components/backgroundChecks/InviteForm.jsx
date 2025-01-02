import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import Flag from "react-world-flags";

const countryCodes = [
  { code: "US", dialCode: "+1" }, // United States
  { code: "IN", dialCode: "+91" }, // India
  { code: "GB", dialCode: "+44" }, // United Kingdom
  { code: "FR", dialCode: "+33" }, // France
  { code: "DE", dialCode: "+49" }, // Germany
  { code: "AU", dialCode: "+61" }, // Australia
  { code: "CA", dialCode: "+1" }, // Canada
  { code: "JP", dialCode: "+81" }, // Japan
  { code: "CN", dialCode: "+86" }, // China
  { code: "BR", dialCode: "+55" }, // Brazil
];

const InviteForm = ({onSubmit}) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    staffId: "",
    joiningDate: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = `${selectedCountry.dialCode}-${formData.phone}`;
    onSubmit({ ...formData, phone });
    console.log(formData);
    setFormData({ name: "", email: "", phone: "", staffId: "", joiningDate: "" });
  }


  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 w-full h-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold font-sans">Invite candidates</h3>
        <FiX className="text-black-600 text-m cursor-pointer" />
      </div>
      <hr className="border-gray-300 w-full mb-5" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <h4 className="text-l font-medium text-black-700">
          Enter Candidate Details
        </h4>
        <div className="relative w-full">
          <label
            htmlFor="email"
            className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-500"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none"
          />
        </div>

        <div className="relative w-full">
          <label
            htmlFor="name"
            className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-500"
          >
            Name
          </label>
          <input
            type="name"
            id="name"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center border border-gray-300 rounded-md p-2 h-12">
            <div className="relative w-full">
              <label
                htmlFor="code"
                className="absolute -top-4 left-3 bg-white px-1 text-sm text-gray-500"
              >
                Code
              </label>

              <div className="flex items-center">
                <Flag
                  code={selectedCountry.code}
                  style={{ width: "20px", height: "20" }}
                />
                <select
                  className="focus:outline-none text-sm w-full p-2 h-full"
                  value={selectedCountry.code}
                  onChange={(e) =>
                    setSelectedCountry(
                      countryCodes.find((c) => c.code === e.target.value)
                    )
                  }
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} {country.dialCode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <label
              htmlFor="mobile"
              className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-500"
            >
              Mobile
            </label>
            <input
              type="phone"
              id="mobile"
              onChange={handleChange}
              className="w-full h-12 border border-gray-300 rounded-md p-2 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="relative w-full">
          <label
            htmlFor="staffId"
            className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-500"
          >
            Staff / Employee ID
          </label>
          <input
            type="text"
            id="stafId"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none"
          />
        </div>
        <div className="relative w-[50%]">
          <label
            htmlFor="date"
            className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-500"
          >
            Joining Date
          </label>
          <input
            type="date"
            id="date"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex justify-between items-center">
          <input
            placeholder="Additional Details"
            onchange={handleChange}
            className="w-60 placeholder-black rounded-md p-2  h-12 focus:outline-none focus:ring-2 focus:ring-purple-600"
          ></input>
          <button className="text-sm font-medium hover:underline ml-4">
            + Add Tags
          </button>
        </div>
        <hr className="text-gray-200 w-full" />
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
