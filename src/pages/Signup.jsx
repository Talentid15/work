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

  const validateEmailDomain = (email) => {
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
    return emailDomain && !freeEmailDomains.includes(emailDomain);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullname":
        if (!value.trim()) return "Full name is required";
        if (value.length < 2 || value.length > 50) return "Full name must be 2-50 characters";
        if (!/^[a-zA-Z\s-]+$/.test(value)) return "Full name can only contain letters, spaces, and hyphens";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email format";
        if (!validateEmailDomain(value)) return "Please use a company email address (not Gmail, Yahoo, etc.)";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone number must be exactly 10 digits";
        return "";
      case "company":
        if (!value.trim()) return "Company name is required";
        if (value.length < 2 || value.length > 100) return "Company name must be 2-100 characters";
        if (!/^[a-zA-Z0-9\s&-]+$/.test(value)) return "Company name can only contain letters, numbers, spaces, &, and -";
        return "";
      case "role":
        if (!value) return "Please select a role";
        if (!["Corporate HR", "HR Agency", "Others"].includes(value)) return "Invalid role selected";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8 || value.length > 50) return "Password must be 8-50 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value))
          return "Password must include uppercase, lowercase, number, and special character";
        return "";
      case "termsAccepted":
        return value ? "" : "You must accept the terms and conditions";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, newValue) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });

    if (Object.values(newErrors).some((error) => error)) {
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
          verifiedDocuments: false,
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
    setShowDocumentPopup(true);
  };

  const handleVerifyOtp = () => {
    setShowEmailPopup(false);
    setShowDocumentPopup(true);
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
          Lets get started. <br />
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