import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useUserStore, useVerificationStore } from "../redux/userStore";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const OtpVerificationPopup = ({ apiUrl, onClose, onSkip, onVerify, onResend }) => {
  const { token } = useSelector((state) => state.user.data || {});
  const { email: storeEmail, setUserData, setEmailVerified } = useUserStore();
  const { is403Error } = useVerificationStore();
  const location = useLocation();
  const user = useSelector((state) => state.user.data);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(300);
  const [inputEmail, setInputEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const urlEmail = queryParams.get("email");

  const email = storeEmail || urlEmail || inputEmail || user?.email || "";

  useEffect(() => {
    console.log("Email sources:", { storeEmail, urlEmail, inputEmail, userEmail: user?.email });
    if (!storeEmail && !urlEmail) {
      setShowEmailInput(true);
    } else if (urlEmail && !storeEmail) {
      setUserData({ email: urlEmail });
    }
  }, [storeEmail, urlEmail, setUserData]);

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
      setOtpError("");
    }
  };

  const handleEmailChange = (e) => {
    setInputEmail(e.target.value);
    setOtpError("");
  };

  const handleVerifyOtp = async () => {
    if (!email) {
      setOtpError("Please provide an email address.");
      return;
    }
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits.");
      return;
    }

    try {
      console.log("Verifying OTP for email:", email);
      const response = await axios.post(
        `${apiUrl}/api/auth/verify-otp`,
        { email, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Verify OTP response:", response.data);
      if (response.data.success) {
        console.log("OTP verification successful");
        setEmailVerified(true);
        toast.success("Email verified successfully!", { id: "email-verified" });
        setOtp("");
        setOtpError("");
        setInputEmail("");
        setShowEmailInput(false);
        setShowOtpInput(false);
        onVerify();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error.message);
      const errorMessage =
        error.response?.status === 403
          ? "Unauthorized. Please log in again or contact support."
          : error.response?.data?.message || "Invalid OTP. Please try again.";
      setOtpError(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    console.log("Attempting to resend OTP for email:", email, "with token:", token);
    if (!email) {
      console.warn("No email provided");
      setOtpError("Please provide an email address.");
      return;
    }

    try {
      console.log("Sending POST request to:", `${apiUrl}/api/auth/resend-otp`);
      const response = await axios.post(
        `${apiUrl}/api/auth/resend-otp`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Resend OTP response:", response.data);
      if (response.data.success) {
        console.log("OTP resent successfully");
        setOtpTimer(300);
        setOtp("");
        setOtpError("");
        setShowOtpInput(true);
        onResend();
      } else {
        console.warn("Resend OTP failed with response:", response.data);
        setOtpError("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error.response?.data || error.message);
      const errorMessage =
        error.response?.status === 403
          ? "Unauthorized. Please log in again or contact support."
          : error.response?.data?.message || "Error resending OTP. Please try again.";
      setOtpError(errorMessage);
    }
  };

  useEffect(() => {
    let timer;
    if (otpTimer > 0 && showOtpInput) {
      timer = setInterval(() => {
        setOtpTimer((prev) => {
          console.log("OTP timer:", prev - 1);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer, showOtpInput]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Verify Your Email</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <p className="mb-4">
          Please verify your email address to continue.
          <strong>{email || "your email"}</strong>.
        </p>
        {!showOtpInput ? (
          <p className="mb-4">
            <button
              onClick={handleResendOtp}
              className="text-blue-500 underline hover:text-blue-700"
            >
              Click here to verify OTP
            </button>
          </p>
        ) : (
          <>
            <p className="mb-4">
              A 6-digit OTP has been sent to <strong>{email || "your email"}</strong>. Please check
              your inbox (and spam/junk folder) and enter it below.
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
            {showEmailInput && (
              <input
                type="email"
                value={inputEmail}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full border-2 border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:border-purple-500"
              />
            )}
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
              <div className="flex space-x-2">
                {!is403Error && (
                  <button
                    onClick={onSkip}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Skip
                  </button>
                )}
                <button
                  onClick={handleVerifyOtp}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationPopup;