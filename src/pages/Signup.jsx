import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import backgroundImage2 from "../assets/rb_3790.png";
import InputField from "../components/InputField";
import { UserContext } from "../context/UserContext";
import OtpVerificationPopup from "./OtpVerify";
import DocumentUploadPopup from "./documentVerify";
import { useUserStore } from "../redux/userStore";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setSignedUp } = useContext(UserContext);
  const { setUserData, setVerifiedDocuments } = useUserStore();
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "http://localhost:4000";

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    password: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);

  const validateEmail = (email) => {
    const freeEmailDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "aol.com",
      "icloud.com",
      "protonmail.com",
      "zoho.com",
    ];
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (!emailDomain) return false;
    return !freeEmailDomains.includes(emailDomain);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "email") {
      if (value && !validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Please use a company email address (not Gmail, Yahoo, etc.)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please use a company email address (not Gmail, Yahoo, etc.)";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.role) newErrors.role = "Please select a role";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        ...formData,
        captchaValue: "mock-captcha-token",
      });
      if (response.status === 200) {
        if (!response.data.data?.userId) {
          throw new Error("No userId returned from signup");
        }
        setSignedUp(true);
        setUserData({
          userId: response.data.data.userId,
          email: formData.email,
          emailVerified: false,
          verifiedDocuments: false, // Initialize as false
        });
        setShowEmailPopup(true);
        setErrors({});
      }
    } catch (error) {
      setSignedUp(false);
      setErrors({
        general: error.response?.data?.message || error.message || "Error during signup. Please try again.",
      });
      console.error("Error during signup:", error);
    }
  };

  const handleSkipOtp = () => {
    setShowEmailPopup(false);
    setUserData((prev) => ({ ...prev, emailVerified: false }));
    setShowDocumentPopup(true); // Always show document popup after skipping OTP
  };

  const handleVerifyOtp = () => {
    setShowEmailPopup(false);
    setShowDocumentPopup(true); // Always show document popup after verifying OTP
  };

  const handleResendOtp = () => {
    toast.success("OTP resent successfully. Check your email.", { id: "otp-resent" });
  };

  const handleSkipDocument = () => {
    setVerifiedDocuments(false);
    setShowDocumentPopup(false);
    toast.success("Signup completed! Please log in to continue.");
    navigate("/login");
  };

  const handleDocumentSubmit = () => {
    setVerifiedDocuments(true);
    setShowDocumentPopup(false);
    toast.success("Document uploaded! Verifying documents...");
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 bg-gradient-to-b from-purple-900 via-purple-700 to-purple-400 text-white flex flex-col justify-center items-center rounded-b-2xl md:rounded-r-3xl md:rounded-b-none p-6">
        <img
          src={backgroundImage2}
          alt="Decorative Image"
          className="w-[80%] md:w-[70%] mb-6"
        />
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Existing user?</h2>
          <p className="mb-4 md:mb-6 text-sm md:text-base">
            Takes a few moments to connect back
          </p>
          <button className="bg-gray-200 transition-all hover:scale-105 text-gray-800 px-6 py-2 text-sm md:text-xl rounded-full font-semibold">
            <a href="/login">Log in</a>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white p-6 md:p-10 flex flex-col justify-center rounded-t-2xl md:rounded-l-2xl md:rounded-t-none">
        <h2 className="text-purple-700 text-center text-3xl md:text-5xl font-bold mb-6">
          Sign Up
        </h2>
        <p className="text-center px-6 md:px-20 mb-4 text-sm md:text-base">
          Let's get started. <br />
          Are you ready to be a part of something new?
        </p>
        {errors.general && (
          <p className="text-red-500 text-center text-sm mb-4">{errors.general}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 md:px-24">
          <InputField
            type="text"
            name="fullname"
            placeholder="Enter your Full Name"
            value={formData.fullname}
            onChange={handleChange}
            error={errors.fullname}
          />
          <InputField
            type="email"
            name="email"
            placeholder="Enter your Company Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            type="tel"
            name="phone"
            placeholder="Enter your Phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <div className="flex flex-col md:flex-row md:space-x-4">
            <InputField
              type="text"
              name="company"
              placeholder="Enter your Company"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
            />
            <div className="w-full mt-3 md:mt-0">
              <select
                name="role"
                className="w-full border-2 border-purple-300 rounded-lg p-3 focus:outline-none focus:border-purple-500 shadow-lg"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="Corporate HR">Corporate HR</option>
                <option value="HR Agency">HR Agency</option>
                <option value="Others">Others</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>
          </div>
          <InputField
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="termsAccepted"
              className="mr-2"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label className="text-gray-600 text-sm">
              I have read and accept the{" "}
              <a href="#" className="text-purple-600 underline">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
          )}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full md:w-[60%] bg-purple-600 text-white p-3 rounded-lg hover:scale-105 transition-all font-semibold hover:bg-purple-700"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>

      {showEmailPopup && (
        <OtpVerificationPopup
          apiUrl={API_URL}
          onClose={() => setShowEmailPopup(false)}
          onSkip={handleSkipOtp}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
        />
      )}

      {showDocumentPopup && (
        <DocumentUploadPopup
          apiUrl={API_URL}
          onClose={() => setShowDocumentPopup(false)}
          onSkip={handleSkipDocument}
          onSubmit={handleDocumentSubmit}
        />
      )}
    </div>
  );
};

export default SignUpForm;