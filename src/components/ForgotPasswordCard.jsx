import { useState } from "react";
import { Eye, EyeOff, Mail, Key, Shield } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ModernLoader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-2xl">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-700 font-medium text-sm">Please wait...</p>
    </div>
  </div>
);

function ForgotPassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate("/login");
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Valid email is required");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/users/send-otp`, { email });
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
      const response = await axios.post(`${API_URL}/api/users/verify-otp`, { email, otp });
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
      await axios.post(`${API_URL}/api/users/reset-password`, { token, password, confirmPassword });
      toast.success("Password changed successfully");
      setTimeout(() => {
        setIsOpen(false);
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case "email": return <Mail className="w-6 h-6 text-purple-600" />;
      case "otp": return <Shield className="w-6 h-6 text-purple-600" />;
      case "reset": return <Key className="w-6 h-6 text-purple-600" />;
      default: return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "email": return "Enter Your Email";
      case "otp": return "Enter OTP";
      case "reset": return "Forgot Password";
      default: return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      {loading && <ModernLoader />}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-6 relative m-4">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            {getStepIcon()}
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            {getStepTitle()}
          </h1>
          <div className="flex justify-center gap-2">
            <div className={`w-6 h-1 rounded-full ${step === "email" ? "bg-purple-600" : "bg-gray-300"}`}></div>
            <div className={`w-6 h-1 rounded-full ${step === "otp" ? "bg-purple-600" : "bg-gray-300"}`}></div>
            <div className={`w-6 h-1 rounded-full ${step === "reset" ? "bg-purple-600" : "bg-gray-300"}`}></div>
          </div>
        </div>
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Send OTP
              </button>
            </div>
          </form>
        )}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="otp">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="6-digit OTP"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-center text-xl font-mono tracking-wider"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Remember your password?{" "}
            <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;