import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

const OfferPunch = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    location: "",
    joiningDate: "",
    offerDate: "",
    status: "",
  });

  const statusOptions = [
    "Offer letter released",
    "Planning for an Offer",
    "Hired",
    "Candidate verbal commitment",
    "Others",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-start justify-start flex-col bg-white px-4">
      <div
        className="flex gap-2 justify-start items-start cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        <IoIosArrowBack size={30}></IoIosArrowBack>
        <h1 className="text-black text-2xl font-semibold">Offer Punch</h1>
      </div>

      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-4xl ml-20 mt-5">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 border-b-slate-300 mb-8 ">
          Enter Candidate Details
        </h2>
        <div className="w-[100%] bg-gray-400 h-[1px] mb-12 z-100"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 ">
          <div className="w-[90%] md:col-span-2 space-y-8">
            {/* Full Name */}
            <div className="relative w-full">
              <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                // placeholder="Enter full name"
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Email Address */}
            <div className="relative w-full">
              <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                // placeholder="Enter full name"
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Mobile Number */}
            <div className="relative w-full">
              <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                // placeholder="Enter full name"
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Location */}
            
          </div>

          {/* Right Side: Status Dropdown */}
          <div className="w-[90%] md:col-span-2 space-y-8 ">
          <div className="relative w-full">
              <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                Job Title
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                // placeholder="Enter full name"
                className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Joining Date & Offer Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative w-full">
                <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                  Joining Date
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  // placeholder="Enter full name"
                  className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="relative w-full">
                <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                  Offer Date
                </label>

                <input
                  type="date"
                  name="offerDate"
                  value={formData.offerDate}
                  onChange={handleChange}
                  // placeholder="Enter full name"
                  className="w-full p-3 border border-gray-400 rounded-lg  focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>
            <div className="relative w-full">
            <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                  Status
                </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring focus:ring-purple-400"
              >
                <option  value="" disabled>
                  Select status
                </option>
                {statusOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button className="bg-purple-900 text-white py-2 px-16 rounded-full shadow-md hover:bg-purple-300 hover:text-black transition-all">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferPunch;
