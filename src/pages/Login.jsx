import { useState } from "react";
import { IoArrowForwardSharp } from "react-icons/io5";
import backgroundImage2 from "../assets/rb_24598.png";
import logo from "../assets/logo.png";
import InputField from "../components/InputField";
import ForgotPasswordCard from "../components/ForgotPasswordCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useDispatch } from "react-redux";


import { setData } from "../redux/UserSlice";

import { Turnstile } from "@marsidev/react-turnstile"

const LoginForm = () => {

  const dispatch = useDispatch();

  const siteKey = import.meta.env.VITE_SITE_KEY;
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL?? '';

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [token, setToken] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();

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
    }

    // Email Validation

    // const genericDomains = [
    //   'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com',
    //   'yandex.com', 'gmx.com', 'zoho.com', 'mail.com', 'inbox.com', 'live.com', 'msn.com', 'qq.com',
    //   'naver.com', 'web.de', 'mail.ru', 'tutanota.com', 'pm.me', 'bk.ru', 'rambler.ru', 'rocketmail.com',
    //   'ymail.com', 'excite.com', 'lycos.com', 'rediffmail.com', 'hushmail.com', 'fastmail.com', 'bellsouth.net',
    //   'verizon.net', 'att.net', 'comcast.net', 'sbcglobal.net', 'charter.net', 'shaw.ca', 'cox.net',
    //   'earthlink.net', 'frontier.com', 'juno.com', 'netzero.net', 'aim.com', 'optonline.net', 'me.com', 'mac.com'
    // ];

    // const emailDomain = formData.email.split('@')[1];

    // if (genericDomains.includes(emailDomain)) {

    //   newErrors.email = 'Please enter a company email address.';

    // }

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
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email: formData.email,
                password: formData.password,
                captchaValue: token
            }, {
                withCredentials: true,
            });
            if (response.status === 202) {
                toast.error("Your documents are being verified. Please try again later.");
                return;
            }
            dispatch(setData(response.data));
            toast.success("Logged in successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error logging in:", error);
                        if (error.response?.status === 202) {
                toast.info("Your documents are being verified. Please try again later.");
            } else {
                toast.error(error.message || "Login failed. Please try again.");
            }
        }
    }
};
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Section */}
      <div
        className={`w-[full] lg:w-[45%] bg-white p-6   transition-transform duration-300 ${showForgotPassword ? "blur-sm" : ""
          }`}
      >
        <div className="flex  flex-col justify-center items-center gap-10 p-6 sm:p-10 lg:rounded-l-3xl">
          <div className=" w-full   p-6 flex justify-start items-start">
            <img src={logo} alt="Logo" className="w-[60%] sm:w-[40%] h-auto" />
          </div>
          <div>
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
              <div className="flex items-center space-y-2 gap-12">
                <Turnstile siteKey={siteKey} onSuccess={(token) => {
                  console.log(token);
                  setToken(token);

                }} />
                <p
                  className=" text-sm text-purple-500 text-center cursor-pointer hover:underline "
                  onClick={handleForgotPasswordClick}
                >
                  Forgot Password?
                </p>
              </div>

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
                  Dont have an account?{" "}
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
      // style={{ backgroundImage: url(${backgroundImage}) }}
      >
        <h1 className="text-2xl sm:text-5xl font-bold mb-4 text-center">
          Welcome Back!
        </h1>
        <p className="w-full sm:w-[80%] text-sm sm:text-base text-center">
          The best way to predict the future is to create it – starting with
          hiring exceptional talent.
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