import React, { useState } from "react";
import { IoArrowForwardSharp } from "react-icons/io5";
import backgroundImage from "../assets/5548971.jpg";
import backgroundImage2 from "../assets/rb_24598.png";
import logo from "../assets/logo.png";
import InputField from "../components/InputField";
import ForgotPasswordCard from "../components/ForgotPasswordCard";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(org|net)$/.test(formData.email)
    ) {
      newErrors.email = "Only company emails are allowed.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "/";
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Section */}
      <div
        className={`w-[full] lg:w-[45%] bg-white p-6   transition-transform duration-300 ${
          showForgotPassword ? "blur-sm" : ""
        }`}
      >
        <div className="flex  flex-col justify-center items-center gap-14 p-6 sm:p-10 lg:rounded-l-3xl">
          <div className=" w-full   p-6 flex justify-start items-start">
            <img src={logo} alt="Logo" className="w-[60%] sm:w-[40%] h-auto" />
          </div>
          <div >
            <h2 className="text-purple-700 text-center text-2xl sm:text-4xl font-bold mb-4">
              Login
            </h2>
            <p className="text-center text-sm sm:text-base mb-4 px-4 sm:px-20">
              Ready to dive back in? Enter your credentials to continue.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 px-4 sm:px-10">
              <InputField
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <InputField
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <p
                className=" text-sm text-purple-500 text-center mt-4 ml-72 cursor-pointer hover:underline lg:ml-80"
                onClick={handleForgotPasswordClick}
              >
                Forgot Password?
              </p>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="w-[75%] sm:w-[40%] transition-all bg-purple-600 text-white p-3 rounded-lg hover:scale-105 font-semibold hover:bg-purple-700 flex items-center justify-center space-x-2"
                >
                  <p>Login</p>
                  <IoArrowForwardSharp size={20} />
                </button>
              </div>
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    Create one
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Card */}
      {showForgotPassword && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <ForgotPasswordCard onClose={handleCloseForgotPassword} />
        </div>
      )}

      {/* Right Section */}
      <div
  className="hidden lg:flex flex-1 bg-center bg-white rounded-3xl lg:rounded-3xl m-3 bg-cover text-white flex-col justify-center items-center p-6 sm:p-10"
  style={{ backgroundImage: `url(${backgroundImage})` }}
>
  <h1 className="text-2xl sm:text-5xl font-bold mb-4 text-center">
    Welcome Back!
  </h1>
  <p className="w-full sm:w-[80%] text-sm sm:text-base text-center">
    The best way to predict the future is to create it – starting with hiring exceptional talent.
  </p>
  <img
    src={backgroundImage2}
    alt="Decorative"
    className="w-[70%] sm:w-[60%] h-auto mt-4"
  />
</div>
                                                        
    </div>
  );
};

export default LoginForm;
