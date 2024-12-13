import React, { useState, useRef, useEffect } from "react";
import loginImage from "../assets/loginImage.png";
import logo from "../assets/logo.png";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-[#652D96]">
        <div className="bg-white flex w-[1000px] h-[700px] rounded-lg shadow-lg overflow-hidden">
          {/* Left Half - Login Details */}
          <div className="w-1/2 px-10 flex flex-col justify-center">
            <img src={logo} alt="logo" className="w-1/2 mb-6" />
            <h2 className="text-2xl font-bold text-[#652D96] mb-6">Sign Up</h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm text-black-600 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#652D96]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm text-black-600 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#652D96]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm text-black-600 mb-2"
                >
                  Phone number
                </label>
                <input
                  type="number"
                  id="phone"
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#652D96]"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="company"
                  className="block text-sm text-black-600 mb-2"
                >
                  Company
                </label>
                <div className="flex flex-row gap-4">
                  <input
                    type="text"
                    id="company"
                    placeholder="Company name"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#652D96]"
                    required
                  />
                  <select
                    id="company"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#652D96]"
                    required
                  >
                    <option value="" disabled selected>
                      Select
                    </option>
                    <option value="hr">Corporate HR</option>
                    <option value="designer">Designer</option>
                    <option value="developer">Developer</option>
                    <option value="tester">Tester</option>
                  </select>
                </div>
              </div>
              <div className="mb-6 relative">
                <label
                  htmlFor="password"
                  className="block text-sm text-black-600 mb-2"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#652D96]"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-2/3 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-[#652D96] text-white py-2 rounded-lg hover:bg-[#4a2171] transition-colors"
              >
                Sign up
              </button>
              <p className="text-[#8080808C] ml-20 py-4">
                Already have an account?{" "}
                <Link to="/login">
                  
                <span className="text-[#465685] underline cursor-pointer">
                  Login
                </span>
                </Link>
              </p>
            </form>
          </div>
          {/* Right Half - Image */}
          <div className="w-1/2 bg-[#F5EBFF] flex items-center justify-center">
            <img src={loginImage} alt="Login Illustration" className="w-2/3" />
          </div>
        </div>
      </div>

      {/*Modal for forget password */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] p-8 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-black">
              Forgot Password
            </h2>
            <label
              htmlFor="modal-username"
              className="block text-sm mb-2 text-[#656565]"
            >
              Enter your email address to reset your password
            </label>
            <input
              type="text"
              id="modal-username"
              placeholder="username@mail.com"
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#652D96] mt-2"
            />
            <div className="w-full">
              <button
                className="bg-[#652D96] w-full text-white px-4 py-2 mt-2 rounded-lg"
                onClick={() => {
                  alert("Password reset link sent!");
                  closeModal();
                }}
              >
                Reset Password
              </button>
              <div className="mt-5 ">
                <p className="text-[#656565]">
                  we will send you an email with the intructions to rest your
                  password
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;
