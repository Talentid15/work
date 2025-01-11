import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordCard = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/auth/forgotPasswordEmail", { email });
      setMessage(response.data.message);

      console.log("res ka data ",response.data);

      
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md relative">
        <button
          className="absolute text-3xl top-3 right-3 text-gray-500 hover:scale-105"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter your email address to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="username@gmail.com"
            className="w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded-lg shadow-lg hover:bg-purple-600 hover:scale-95 transition-all"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p className="text-sm text-red-500 text-center mt-4">{message}</p>
        )}
        <p className="text-sm text-gray-600 text-center mt-4">
          We will send you an email with instructions to reset your password.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordCard;
