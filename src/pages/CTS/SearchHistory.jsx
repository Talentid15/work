import { useState, useEffect } from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { formateDate } from "../../utils";
import { FaUserPlus } from "react-icons/fa";

const SearchHistory = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.data?.token);
  const [profileData, setProfileData] = useState({
    user: {},
    inviteLinks: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
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

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r mt-10 from-purple-700 rounded-full to-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-white hover:text-purple-200 transition-colors duration-200"
              aria-label="Go back"
            >
              <IoIosArrowBack className="text-2xl" />
              <span className="ml-2 text-lg font-semibold">Search History</span>
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
              <button className="flex items-center px-4 py-2 text-purple-900 bg-white rounded-full hover:bg-purple-100 transition-all duration-200 shadow-md">
                <FaFileCircleQuestion className="h-5 w-5 mr-2" />
                History
              </button>
            </Link>
            <Link to="/invite">
              <button className="flex items-center px-4 py-2 text-white bg-transparent border border-white rounded-full hover:bg-purple-600 hover:border-transparent transition-all duration-200">
                <FaUserPlus className="h-5 w-5 mr-2" />
                Invites
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white  overflow-hidden animate-fade-in">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-4 text-sm font-semibold">Email</th>
                      <th className="p-4 text-sm font-semibold">Last Action</th>
                      <th className="p-4 text-sm font-semibold">Action</th>
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
                          className="border-b last:border-none hover:bg-purple-50 transition-all duration-200"
                        >
                          <td className="p-4 text-sm text-gray-600">{link.email}</td>
                          <td className="p-4 text-sm text-gray-600">
                            {formateDate(link.createdAt || profileData.user.createdAt)}
                          </td>
                          <td className="p-4">
                            <button
                              className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 hover:scale-105 transition-all duration-200 shadow-sm"
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