import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserPlus, Send, Users, FileText, ArrowLeft, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const InvitePage = () => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Navbar */}
      <header className="relative  backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-700 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-2"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
              <span className="ml-2 text-lg font-semibold">Invite Candidate</span>
            </button>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="group relative">
              <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200">
                <Users className="h-5 w-5 mr-2" />
                Track
              </button>
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                Track Candidates
              </span>
            </Link>
            <Link to="/history" className="group relative">
              <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200">
                <FileText className="h-5 w-5 mr-2" />
                History
              </button>
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                View History
              </span>
            </Link>
            <Link to="/invite" className="group relative">
              <button className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md">
                <UserPlus className="h-5 w-5 mr-2" />
                Invites
              </button>
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                Send Invites
              </span>
            </Link>
          </nav>
          <button className="md:hidden text-gray-700 hover:text-purple-600 focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg px-4 py-6 animate-slide-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={toggleMenu}>
                <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 w-full text-left">
                  <Users className="h-5 w-5 mr-2" />
                  Track
                </button>
              </Link>
              <Link to="/history" onClick={toggleMenu}>
                <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 w-full text-left">
                  <FileText className="h-5 w-5 mr-2" />
                  History
                </button>
              </Link>
              <Link to="/invite" onClick={toggleMenu}>
                <button className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 w-full text-left">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Invites
                </button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-xl p-8 w-full max-w-lg border border-white/50 animate-fade-in">
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
                className="w-full p-4 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md bg-white/80"
                aria-label="Email address for invitation"
              />
              <UserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 group-hover:text-purple-600 transition-colors duration-200" size={20} />
            </div>
            <button
              onClick={handleInvite}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              aria-label="Send invitation"
            >
              <Send className="h-5 w-5" />
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