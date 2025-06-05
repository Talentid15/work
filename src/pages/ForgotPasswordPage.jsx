import { useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [token, setToken] = useState("");

  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Valid email is required");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/auth/send-otp`, { email });
      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!otp) {
      toast.error("OTP is required");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp });
      setToken(response.data.token);
      toast.success("OTP verified successfully");
      setStep("reset");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/auth/reset-password`, { token, password, confirmPassword });
      toast.success("Password changed successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 min-h-screen w-full justify-center items-center">
      {loading && <Loader />}
      <div className="flex flex-col justify-center items-center border gap-3 rounded-xl shadow-2xl p-10">
        <h1 className="text-center text-black text-xl font-semibold">
          {step === "email" ? "Enter Your Email" : step === "otp" ? "Enter OTP" : "Reset Your Password"}
        </h1>
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label className="text-gray-800" htmlFor="email">Emailddddddd</label>
              <input
                placeholder="Enter your email"
                className="bg-[#f5f5f5] text-black placeholder:text-xs lg:placeholder:text-lg placeholder:text-gray-500 p-3 focus:outline-none rounded-lg lg:w-[400px] w-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="rounded-full border mt-3 w-fit p-3 bg-indigo-500 text-white"
            >
              Send OTP
            </button>
          </form>
        )}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label className="text-gray-800" htmlFor="otp">OTP</label>
              <input
                placeholder="Enter OTP"
                className="bg-[#f5f5f5] text-black placeholder:text-xs lg:placeholder:text-lg placeholder:text-gray-500 p-3 focus:outline-none rounded-lg lg:w-[400px] w-full"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="rounded-full border mt-3 w-fit p-3 bg-indigo-500 text-white"
            >
              Verify OTP
            </button>
          </form>
        )}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
            <div className="relative flex flex-col">
              <label className="text-gray-800" htmlFor="password">New Password</label>
              <div className="relative w-full lg:w-max">
                <input
                  placeholder="Enter new password"
                  className="bg-[#f5f5f5] text-black placeholder:text-xs lg:placeholder:text-lg placeholder:text-gray-500 p-3 focus:outline-none rounded-lg lg:w-[400px] w-full"
                  type={showPassword ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-4 right-4 cursor-pointer"
                >
                  {showPassword ? <VscEye /> : <VscEyeClosed />}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-800" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative w-full lg:w-max">
                <input
                  placeholder="Confirm new password"
                  className="bg-[#f5f5f5] text-black placeholder:text-xs lg:placeholder:text-lg placeholder:text-gray-500 p-3 focus:outline-none rounded-lg lg:w-[400px] w-full"
                  type={showConfirmPassword ? "password" : "text"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-4 right-4 cursor-pointer"
                >
                  {showConfirmPassword ? <VscEye /> : <VscEyeClosed />}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-full border mt-3 w-fit p-3 bg-indigo-500 text-white"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;