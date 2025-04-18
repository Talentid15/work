import { useState, useEffect } from "react";
import axios from "axios";
import {useUserStore} from "../redux/userStore";

const OtpVerificationPopup = ({ apiUrl, onClose, onSkip, onVerify, onResend }) => {
  const { email } = useUserStore();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
      setOtpError("");
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
      console.log("Verifying OTP for email:", email); // Debug
      const response = await axios.post(`${apiUrl}/api/auth/verify-otp`, {
        email,
        otp,
      });
      if (response.data.success) {
        console.log("OTP verification successful"); // Debug
        setOtp("");
        setOtpError("");
        onVerify();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error); // Debug
      setOtpError(error.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      console.log("Resending OTP for email:", email); // Debug
      const response = await axios.post(`${apiUrl}/api/auth/resend-otp`, {
        email,
      });
      if (response.data.success) {
        console.log("OTP resent successfully"); // Debug
        setOtpTimer(300);
        setOtp("");
        onResend();
      }
    } catch (error) {
      console.error("Error resending OTP:", error); // Debug
      setOtpError(error.response?.data?.message || "Error resending OTP.");
    }
  };

  // OTP timer
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Verify Your Email</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <p className="mb-4">
          A 6-digit OTP has been sent to <strong>{email || "your email"}</strong>. Please check your
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
          <div className="flex space-x-2">
            <button
              onClick={onSkip}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Skip
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
    </div>
  );
};

export default OtpVerificationPopup;