import { useState, useEffect } from "react";
import { Users, FileText, UserPlus, ArrowLeft, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formateDate } from "../../utils";
import api from "../../utils/api";

const SearchHistory = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.data?.token);
  const [profileData, setProfileData] = useState({
    user: {},
    inviteLinks: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(
          `${API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );

        if (response.data?.success) {
          const { user = {} } = response.data;
          setProfileData({
            user,
            inviteLinks: user.inviteLinks || []
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const inviteLinks = [...(profileData.inviteLinks || [])].reverse();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Navbar */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-700 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-2"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
              <span className="ml-2 text-lg font-semibold">Search History</span>
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
              <button className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md">
                <FileText className="h-5 w-5 mr-2" />
                History
              </button>
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                View History
              </span>
            </Link>
            <Link to="/invite" className="group relative">
              <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200">
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
                <button className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 w-full text-left">
                  <FileText className="h-5 w-5 mr-2" />
                  History
                </button>
              </Link>
              <Link to="/invite" onClick={toggleMenu}>
                <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 w-full text-left">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Invites
                </button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/30 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 animate-fade-in overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-12 w-12 text-purple-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-4 text-sm font-medium">Email</th>
                      <th className="p-4 text-sm font-medium">Last Action</th>
                      <th className="p-4 text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inviteLinks.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-4 text-center text-gray-500">
                          No search history available
                        </td>
                      </tr>
                    ) : (
                      inviteLinks.map((link, index) => (
                        <tr
                          key={index}
                          className="border-b last:border-none hover:bg-purple-50/50 transition-all duration-200"
                        >
                          <td className="p-4 text-sm text-gray-600">{link.email}</td>
                          <td className="p-4 text-sm text-gray-600">
                            {formateDate(link.createdAt || profileData.user.createdAt)}
                          </td>
                          <td className="p-4">
                            <button
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 hover:scale-105 transition-all duration-200 shadow-sm"
                              aria-label={link.type === "view" ? "View more" : "Invited"}
                            >
                              {link.type === "view" ? "View More" : "Invited"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchHistory;