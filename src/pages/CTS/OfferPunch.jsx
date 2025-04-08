import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const OfferPunch = () => {
  const navigate = useNavigate();
  const data = useSelector((state) => state.user.data);
  const token = useSelector((state) => state.user.data?.token);

  console.log("user data ", data);

  const [formData, setFormData] = useState({
    jobTitle: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhoneNo: "",
    companyName: "",
    joiningDate: "",
    expiryDate: "",
    offerLetter: null,
    candidateResume: null,
    offerLetterStatus: "",
  });

  const statusOptions = ["Offer letter released", "Candidate verbal commitment"];
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!formData.offerLetter || !formData.candidateResume) {
      toast.error("Please Upload Offer Letter and Candidate Resume");
      return;
    }

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });

    console.log("Submitting Form Data:");
    for (let [key, value] of submissionData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/offer/create-offer-punch`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Response:", response.data);
      toast.success("Offer submitted successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      toast.error("Failed to submit offer. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-start bg-white px-4">
      <div
        className="flex gap-2 justify-start items-start cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack size={30} />
        <h1 className="text-black text-2xl font-semibold">Offer Punch</h1>
      </div>

      <form
        className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-4xl ml-20 mt-5"
        onSubmit={formSubmitHandler}
      >
        <h2 className="text-xl font-semibold text-gray-900 border-b mb-8">
          Enter Candidate Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="w-[90%] md:col-span-2 space-y-6">
            <InputField label="Candidate Name" name="candidateName" value={formData.candidateName} onChange={handleChange} />
            <InputField label="Candidate Email" type="email" name="candidateEmail" value={formData.candidateEmail} onChange={handleChange} />
            <InputField label="Candidate Phone No" type="tel" name="candidatePhoneNo" value={formData.candidatePhoneNo} onChange={handleChange} />
          </div>

          <div className="w-[90%] md:col-span-2 space-y-6">
            <InputField label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
            <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Joining Date" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
              <InputField label="Expiry Date" type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
            </div>
            <div className="relative w-full">
              <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                Status
              </label>
              <select
                name="offerLetterStatus"
                value={formData.offerLetterStatus}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring focus:ring-purple-400"
              >
                <option value="" disabled>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FileInput label="Offer Letter (PDF)" name="offerLetter" onChange={handleChange} />
          <FileInput label="Resume (PDF)" name="candidateResume" onChange={handleChange} />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-purple-900 text-white py-2 px-16 rounded-full shadow-md hover:bg-purple-300 hover:text-black transition-all"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, type = "text", name, value, onChange }) => (
  <div className="relative w-full">
    <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-300"
    />
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div className="relative w-full">
    <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
      {label}
    </label>
    <input
      type="file"
      name={name}
      accept=".pdf"
      onChange={onChange}
      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-400"
    />
  </div>
);

export default OfferPunch;