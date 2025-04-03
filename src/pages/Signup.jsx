// components/SignUpForm.js
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage2 from "../assets/rb_3790.png";
import InputField from "../components/InputField";
import { UserContext } from "../context/UserContext";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setSignedUp } = useContext(UserContext);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    password: "",
    termsAccepted: false,
    captchaValue: "",
  });
  const [errors,] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [file, setFile] = useState(null); // Single file
  const [fileSelectedMessage, setFileSelectedMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [uploadError, setUploadError] = useState("");

  // Handle input changes for signup form (unchanged)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle single file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError("File size exceeds 5MB limit.");
        return;
      }
      setFile(selectedFile);
      setFileSelectedMessage(`Selected: ${selectedFile.name}`);
    } else {
      setFile(null);
      setFileSelectedMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        try {
      const response = await axios.post("http://localhost:4000/api/auth/signup", formData);
      if (response.status === 200) {
        setSignedUp(true);
        setUserId(response.data.data.userId);
        setShowPopup(true);
      }
    } catch (error) {
      setSignedUp(false);
      console.error("Error during signup:", error);
    }
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadError("Please upload a document.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file); 

    reader.onload = async () => {
      const base64String = reader.result;
      
      try {
        const response = await axios.post(
          "http://localhost:4000/api/auth/upload-documents",
          {
            userId,
            document: base64String,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          setShowPopup(false);
          console.log("Cloudinary URL:", response.data.url);
          navigate("/login");
        }
      } catch (error) {
        setUploadError(
          error.response?.data?.message || "Error uploading document."
        );
        console.error("Upload error:", error);
      }
    };

    reader.onerror = () => {
      setUploadError("Error reading file.");
      console.error("FileReader error");
    };
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
          Lets get started. <br />
          Are you ready to be a part of something new?
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
              placeholder="Enter your Company"
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

      {/* Popup for Document Upload */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Verification</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="mb-4">
              Upload a copy of your company identity (e.g., Business Registration Document, CIN Document, GST Document). <br />
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
              {uploadError && (
                <p className="text-red-500 text-sm mb-4">{uploadError}</p>
              )}
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