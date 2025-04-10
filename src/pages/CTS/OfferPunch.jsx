import { useState, useEffect } from "react";
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
    offerLetter: null, // Will store base64 string
    candidateResume: null, // Will store base64 string
    offerLetterStatus: "",
  });

  const [errors, setErrors] = useState({});

  const statusOptions = ["Offer letter released", "Candidate verbal commitment"];
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job Title is required";
    if (!formData.candidateName.trim()) newErrors.candidateName = "Candidate Name is required";
    if (!formData.candidateEmail.trim()) {
      newErrors.candidateEmail = "Candidate Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.candidateEmail)) {
      newErrors.candidateEmail = "Invalid email format";
    }
    if (!formData.candidatePhoneNo.trim()) {
      newErrors.candidatePhoneNo = "Candidate Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.candidatePhoneNo)) {
      newErrors.candidatePhoneNo = "Phone number must be 10 digits";
    }
    if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!formData.joiningDate) newErrors.joiningDate = "Joining Date is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry Date is required";
    else if (new Date(formData.expiryDate) <= new Date(formData.joiningDate)) {
      newErrors.expiryDate = "Expiry Date must be after Joining Date";
    }
    if (!formData.offerLetter) newErrors.offerLetter = "Offer Letter is required";
    if (!formData.candidateResume) newErrors.candidateResume = "Candidate Resume is required";
    if (!formData.offerLetterStatus) newErrors.offerLetterStatus = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error(`${name === "offerLetter" ? "Offer Letter" : "Resume"} size exceeds 5MB limit.`);
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setFormData((prevData) => ({
            ...prevData,
            [name]: reader.result, // Store base64 string
          }));
          setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on valid input
        };
        reader.onerror = () => toast.error(`Error reading ${name === "offerLetter" ? "Offer Letter" : "Resume"}`);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on valid input
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/offer/create-offer-punch`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
            <InputField label="Candidate Name" name="candidateName" value={formData.candidateName} onChange={handleChange} error={errors.candidateName} />
            <InputField label="Candidate Email" type="email" name="candidateEmail" value={formData.candidateEmail} onChange={handleChange} error={errors.candidateEmail} />
            <InputField label="Candidate Phone No" type="tel" name="candidatePhoneNo" value={formData.candidatePhoneNo} onChange={handleChange} error={errors.candidatePhoneNo} />
          </div>

          <div className="w-[90%] md:col-span-2 space-y-6">
            <InputField label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} error={errors.jobTitle} />
            <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Joining Date" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} error={errors.joiningDate} />
              <InputField label="Expiry Date" type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} error={errors.expiryDate} />
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
              {errors.offerLetterStatus && <p className="text-red-500 text-sm">{errors.offerLetterStatus}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FileInput label="Offer Letter (PDF)" name="offerLetter" onChange={handleChange} error={errors.offerLetter} />
          <FileInput label="Resume (PDF)" name="candidateResume" onChange={handleChange} error={errors.candidateResume} />
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

const InputField = ({ label, type = "text", name, value, onChange, error }) => (
  <div className="relative w-full">
    <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-3 border ${error ? "border-red-500" : "border-gray-400"} rounded-lg focus:ring-2 focus:ring-purple-300`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const FileInput = ({ label, name, onChange, error }) => (
  <div className="relative w-full">
    <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
      {label}
    </label>
    <input
      type="file"
      name={name}
      accept=".pdf"
      onChange={onChange}
      className={`w-full p-3 border ${error ? "border-red-500" : "border-gray-400"} rounded-lg focus:ring-2 focus:ring-purple-400`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default OfferPunch;