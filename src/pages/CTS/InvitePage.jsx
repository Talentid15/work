import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserPlus, FaPaperPlane } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUsers } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { useSelector } from "react-redux";

const InvitePage = () => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.data?.token);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

  const handleInvite = async () => {
    if (!inviteEmail) {
      setError("Please enter an email address to invite");
      toast.error("Please enter an email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/users/invite`,
        { email: inviteEmail },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setError("");
      setInviteEmail("");
      toast.success(response.data.message || "Invitation sent successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send invitation");
      toast.error(error.response?.data?.message || "Failed to send invitation");
    }
  };

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg rounded-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-white hover:text-purple-200 transition-colors duration-200"
              aria-label="Go back"
            >
              <IoIosArrowBack className="text-2xl" />
              <span className="ml-2 text-lg font-semibold">Invite Candidate</span>
            </button>
          </div>
          <nav className="flex space-x-3 mt-4 sm:mt-0">
            <Link to="/">
              <button className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-all duration-200 shadow-md">
                <HiOutlineUsers className="h-5 w-5 mr-2" />
                Track
              </button>
            </Link>
            <Link to="/history">
              <button className="flex items-center px-4 py-2 text-white bg-transparent border border-white rounded-full hover:bg-purple-600 hover:border-transparent transition-all duration-200">
                <FaFileCircleQuestion className="h-5 w-5 mr-2" />
                History
              </button>
            </Link>
            <Link to="/invite">
              <button className="flex items-center px-4 py-2 text-purple-900 bg-white rounded-full hover:bg-purple-100 transition-all duration-200 shadow-md">
                <FaUserPlus className="h-5 w-5 mr-2" />
                Invites
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg animate-fade-in">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Invite a Candidate
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Send an invitation to join the hiring pipeline.
          </p>
          <div className="space-y-6">
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleInvite()}
                className="w-full p-4 pl-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
                aria-label="Email address for invitation"
              />
              <FaUserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 group-hover:text-purple-600 transition-colors duration-200" />
            </div>
            <button
              onClick={handleInvite}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              aria-label="Send invitation"
            >
              <FaPaperPlane className="h-5 w-5" />
              <span>Send Invite</span>
            </button>
            {error && (
              <p className="text-sm text-red-500 text-center animate-pulse">{error}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvitePage;