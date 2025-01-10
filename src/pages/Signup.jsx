import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage2 from "../assets/rb_3790.png";
import InputField from "../components/InputField";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    password: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name Validation
    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required.";
    }

    // Email Validation
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(org|net)$/.test(formData.email)
    ) {
      newErrors.email = "Only company emails are allowed.";
    }

    // Phone Number Validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else {
      const passwordStrengthRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordStrengthRegex.test(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.";
      }
    }

    // Terms and Conditions Check
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log(formData);
        const response = await axios.post(
          "http://localhost:5000/api/auth/signup",
          formData,
          { withCredentials: true }
        );

        if (response.status === 200) {
          alert("Form submitted successfully!");
          navigate("/");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while submitting the form. Please try again.");
      }
    }
  };

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
          Let's get started. <br></br>Are you ready to be a part of something new?
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 md:px-24">
          <InputField
            type="text"
            name="fullname"
            placeholder="Enter your Full Name"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <InputField
            type="email"
            name="email"
            placeholder="Enter your Email"
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
              placeholder="Company "
              value={formData.company}
              onChange={handleChange}
            />
            <select
              name="role"
              className="w-full mt-3 md:mt-0 border-2 border-purple-300 rounded-lg p-3 focus:outline-none focus:border-purple-500 shadow-lg"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="Corporate HR">Corporate HR</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
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
    </div>
  );
};

export default SignUpForm;
