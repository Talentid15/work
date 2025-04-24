import { useState, useRef } from "react";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const OfferPunch = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.data?.token);
  const formRef = useRef(null);

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const statusOptions = ["Offer letter released", "Candidate verbal commitment"];
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job Title is required";
    if (!formData.candidateName.trim()) newErrors.candidateName = "Candidate Name is required";
    if (!formData.candidateEmail.trim()) {
      newErrors.candidateEmail = "Candidate Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidateEmail)) {
      newErrors.candidateEmail = "Invalid email format";
    }
    if (!formData.candidatePhoneNo.trim()) {
      newErrors.candidatePhoneNo = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.candidatePhoneNo)) {
      newErrors.candidatePhoneNo = "Phone number must be 10 digits";
    }
    if (!formData.companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!formData.joiningDate) newErrors.joiningDate = "Joining Date is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry Date is required";
    else if (new Date(formData.expiryDate) <= new Date(formData.joiningDate)) {
      newErrors.expiryDate = "Expiry Date must be after Joining Date";
    }
    if (!formData.offerLetter) newErrors.offerLetter = "Offer Letter (PDF) is required";
    if (!formData.candidateResume) newErrors.candidateResume = "Candidate Resume (PDF) is required";
    if (!formData.offerLetterStatus) newErrors.offerLetterStatus = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        if (file.type !== "application/pdf") {
          toast.error(`${name === "offerLetter" ? "Offer Letter" : "Resume"} must be a PDF file.`);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${name === "offerLetter" ? "Offer Letter" : "Resume"} size exceeds 5MB limit.`);
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setFormData((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
          setErrors((prev) => ({ ...prev, [name]: "" }));
          setTouched((prev) => ({ ...prev, [name]: true }));
        };
        reader.onerror = () => toast.error(`Error reading ${name === "offerLetter" ? "Offer Letter" : "Resume"}`);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateForm();
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      const firstErrorField = Object.keys(errors)[0];
      formRef.current.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
       await axios.post(
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
      toast.success("Offer submitted successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      toast.error("Failed to submit offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setErrors({});
    setTouched({});
    toast.success("Form reset successfully!");
  };

  const completionPercentage = Math.round(
    (Object.values(formData).filter((val) => val !== "" && val !== null).length / Object.keys(formData).length) * 100
  );

  const isFormValid = Object.keys(errors).length === 0 && Object.values(formData).every((val) => val !== "" && val !== null);

  return (
    <div className="min-h-screen  flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm z-10">
        <div className="flex items-center">
          <h1 className="ml-4 text-2xl font-bold text-gray-800">Offer Punch</h1>
        </div>
        <div className="text-sm text-gray-600">
          Completion: <span className="font-semibold text-purple-600">{completionPercentage}%</span>
        </div>
      </div>

      {/* Form Card */}
      <form
        ref={formRef}
        onSubmit={formSubmitHandler}
        className="w-full max-w-5xl bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-white/50"
      >
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-6">
          Enter Candidate Details
        </h2>

        {/* Candidate Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Candidate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Candidate Name"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.candidateName}
              touched={touched.candidateName}
            />
            <InputField
              label="Candidate Email"
              type="email"
              name="candidateEmail"
              value={formData.candidateEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.candidateEmail}
              touched={touched.candidateEmail}
            />
            <InputField
              label="Candidate Phone No"
              type="tel"
              name="candidatePhoneNo"
              value={formData.candidatePhoneNo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.candidatePhoneNo}
              touched={touched.candidatePhoneNo}
            />
          </div>
        </div>

        {/* Offer Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Offer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.jobTitle}
              touched={touched.jobTitle}
            />
            <InputField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.companyName}
              touched={touched.companyName}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Joining Date"
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.joiningDate}
                touched={touched.joiningDate}
              />
              <InputField
                label="Expiry Date"
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.expiryDate}
                touched={touched.expiryDate}
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white/50 px-2 text-sm text-gray-600 font-medium">
                Status
              </label>
              <div className="relative">
                <select
                  name="offerLetterStatus"
                  value={formData.offerLetterStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-all appearance-none ${
                    errors.offerLetterStatus && touched.offerLetterStatus ? "border-red-500" : "border-gray-300"
                  } bg-white/50`}
                  aria-invalid={errors.offerLetterStatus && touched.offerLetterStatus ? "true" : "false"}
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {touched.offerLetterStatus && !errors.offerLetterStatus && formData.offerLetterStatus && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                )}
                {touched.offerLetterStatus && errors.offerLetterStatus && (
                  <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
                )}
              </div>
              {errors.offerLetterStatus && touched.offerLetterStatus && (
                <p className="text-red-500 text-sm mt-1">{errors.offerLetterStatus}</p>
              )}
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput
              label="Offer Letter (PDF)"
              name="offerLetter"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.offerLetter}
              touched={touched.offerLetter}
            />
            <FileInput
              label="Resume (PDF)"
              name="candidateResume"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.candidateResume}
              touched={touched.candidateResume}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-between items-center">
          <button
            type="button"
            onClick={resetForm}
            className="py-2.5 px-6 rounded-full font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300"
            disabled={isSubmitting}
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`py-2.5 px-8 rounded-full font-semibold text-white transition-all duration-300 flex items-center justify-center ${
              isFormValid && !isSubmitting
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            aria-label="Submit offer"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : null}
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, type = "text", name, value, onChange, onBlur, error, touched }) => (
  <div className="relative">
    <label
      className=" bg-white/50 px-2 text-sm text-gray-600 font-medium"
      htmlFor={name}
    >
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-all bg-white/50 ${
          error && touched ? "border-red-500" : "border-gray-300"
        }`}
        aria-invalid={error && touched ? "true" : "false"}
        aria-describedby={`${name}-error`}
      />
      {touched && !error && value && (
        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
      )}
      {touched && error && (
        <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
      )}
    </div>
    {error && touched && (
      <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
        {error}
      </p>
    )}
  </div>
);

// File Input Component
const FileInput = ({ label, name, onChange, onBlur, error, touched }) => (
  <div className="relative group">
    <label
      className="absolute -top-2.5 left-3 bg-white/50 px-2 text-sm text-gray-600 font-medium"
      htmlFor={name}
    >
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        name={name}
        id={name}
        accept="application/pdf"
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-all bg-white/50 ${
          error && touched ? "border-red-500" : "border-gray-300"
        }`}
        aria-invalid={error && touched ? "true" : "false"}
        aria-describedby={`${name}-error`}
      />
      {touched && !error && formData[name] && (
        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
      )}
      {touched && error && (
        <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
      )}
    </div>
    <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 mt-1 z-10">
      Upload a PDF file (max 5MB)
    </div>
    {error && touched && (
      <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
        {error}
      </p>
    )}
  </div>
);

export default OfferPunch;