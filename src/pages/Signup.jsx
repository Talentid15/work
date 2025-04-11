import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage2 from "../assets/rb_3790.png"; // Ensure this asset exists
import InputField from "../components/InputField";
import { UserContext } from "../context/UserContext";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setSignedUp } = useContext(UserContext);
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
  const [file, setFile] = useState(null);
  const [fileSelectedMessage, setFileSelectedMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds


  // Validate company email
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

  // Handle input changes
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

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError("File size exceeds 5MB limit.");
        return;
      }
      setFile(selectedFile);
      setFileSelectedMessage(`Selected: ${selectedFile.name}`);
      setUploadError("");
    } else {
      setFile(null);
      setFileSelectedMessage("");
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
      setOtpError("");
    }
  };

  // Handle signup form submission
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
        captchaValue: "mock-captcha-token", // Mock value since CAPTCHA is disabled on server
      });
      if (response.status === 200) {
        if (!response.data.data?.userId) {
          throw new Error("No userId returned from signup");
        }
        setSignedUp(true);
        setUserId(response.data.data.userId);
        setShowEmailPopup(true);
        setOtpTimer(300);
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

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: formData.email, // Corrected to pass email as a key-value pair
        otp: otp,             // Explicitly named for clarity
      });
      if (response.data.success) {
        setShowEmailPopup(false);
        setShowDocumentPopup(true); // Show ad popup
        setOtp("");
        setOtpError("");
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || "Invalid OTP. Please try again.");
      console.error("Error verifying OTP:", error);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/resend-otp`, {
        email: formData.email,
      });
      if (response.data.success) {
        setOtpTimer(300); // Reset timer
        setOtp("");       // Clear previous OTP
        alert("OTP resent successfully. Check your email.");
      }
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "Error resending OTP.",
      });
      console.error("Error resending OTP:", error);
    }
  };

  // Handle document submission
  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Please upload a document.");
      return;
    }
    if (!userId) {
      setUploadError("User ID is missing. Please sign up again.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64String = reader.result;

      try {
        const response = await axios.post(
          `${API_URL}/api/auth/upload-documents`,
          {
            userId,
            document: base64String,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          setShowDocumentPopup(false);
          navigate("/login");
        }
      } catch (error) {
        setUploadError(error.response?.data?.message || "Error uploading document.");
        console.error("Upload error:", error);
      }
    };

    reader.onerror = () => {
      setUploadError("Error reading file.");
      console.error("FileReader error");
    };
  };

  // OTP timer
  useEffect(() => {
    let timer;
    if (showEmailPopup && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showEmailPopup, otpTimer]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section */}
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

      {/* Right Section */}
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

      {/* Email Verification Popup with OTP */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Verify Your Email</h2>
              <button
                onClick={() => setShowEmailPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="mb-4">
              A 6-digit OTP has been sent to <strong>{formData.email}</strong>. Please check your
              inbox (and spam/junk folder) and enter it below.
              {otpTimer > 0 ? (
                <span>
                  {" "}
                  Time remaining: {Math.floor(otpTimer / 60)}:
                  {(otpTimer % 60).toString().padStart(2, "0")}
                </span>
              ) : (
                <span className="text-red-500"> OTP expired. Please resend.</span>
              )}
            </p>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              maxLength="6"
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:border-purple-500"
            />
            {otpError && <p className="text-red-500 text-sm mb-4">{otpError}</p>}
            <div className="flex justify-between">
              <button onClick={handleResendOtp} className="text-blue-500 underline">
                Resend OTP
              </button>
              <button
                onClick={handleVerifyOtp}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {showDocumentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Verification</h2>
              <button
                onClick={() => setShowDocumentPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="mb-4">
              Upload a copy of your company identity (e.g., Business Registration Document, CIN
              Document, GST Document). <br />
              Allowed formats: png, jpg, jpeg, pdf (max 5MB).
            </p>
            <form onSubmit={handleDocumentSubmit}>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 text-center">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="text-gray-500">Drop your file to upload or browse</p>
                </label>
                {fileSelectedMessage && (
                  <p className="text-green-500 text-sm mt-2">{fileSelectedMessage}</p>
                )}
              </div>
              {uploadError && <p className="text-red-500 text-sm mb-4">{uploadError}</p>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;