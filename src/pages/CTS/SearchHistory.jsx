import { useState, useEffect } from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { formateDate } from "../../utils";

const SearchHistory = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user.data || {});
  const [profileData, setProfileData] = useState({
    user: {},
    inviteLinks: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL?? '';

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

  // Reverse the inviteLinks array to show latest first
  const inviteLinks = [...(profileData.inviteLinks || [])].reverse();
  console.log("invite links data ", inviteLinks);

  return (
    <div className="relative h-full overflow-hidden p-6 md:p-8 flex flex-col bg-white">
      {/* Header */}
      <div className="w-full relative flex flex-col md:flex-row align-start justify-between pb-5 border-b border-gray-300 mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button className="flex items-center text-gray-800 focus:outline-none">
            <IoIosArrowBack 
              className="text-2xl mr-4" 
              onClick={() => navigate("/")}
            />
            <span className="font-bold text-xl md:text-2xl">Search History</span>
          </button>
        </div>

        <div className="flex justify-end items-center gap-4">
          <Link to="/">
            <button className="flex items-center px-4 py-2 bg-white font-semibold border-purple-600 rounded-full text-gray-800 hover:bg-gray-100 space-x-3 transition duration-200 shadow-md">
              <HiOutlineUsers className="h-5 w-5" />
              <span>Track Candidate</span>
            </button>
          </Link>

          <button className="flex items-center px-5 py-2 bg-[#74449E] text-white rounded-full hover:bg-[#5a2889] space-x-3 transition duration-200 shadow-md">
            <FaFileCircleQuestion className="h-5 w-5" />
            <span>History</span>
          </button>
          <Link to="/invite">
            <button className="flex items-center px-4 py-2 bg-white font-semibold border-purple-600 rounded-full text-gray-800 hover:bg-gray-100 space-x-3 transition duration-200 shadow-md">
              <HiOutlineUsers className="h-5 w-5" />
              <span>Invites</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative h-[30rem]">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className="w-full relative bg-white shadow-lg rounded-xl border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
                <th className="p-4 text-md">Email</th>
                <th className="p-4 text-md">Last Action on</th>
                <th className="p-4 text-md">Action</th>
              </tr>
            </thead>
            <tbody>
              {inviteLinks.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-600">
                    No search history available
                  </td>
                </tr>
              ) : (
                inviteLinks.map((link, index) => (
                  <tr key={index} className="border-b last:border-none hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-600">{link.email}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {formateDate(link.createdAt || profileData.user.createdAt)}
                    </td>
                    <td className="p-4">
                      {link.type === 'view' ? (
                        <button className="text-sm text-white bg-purple-600 rounded-full px-5 py-2 font-medium hover:bg-purple-200 hover:text-black focus:ring-2 focus:ring-purple-500 transition duration-200">
                          View more
                        </button>
                      ) : (
                        <button className="text-sm text-white bg-purple-600 rounded-full px-5 py-2 font-medium hover:bg-purple-200 hover:text-black focus:ring-2 focus:ring-purple-500 transition duration-200">Invited</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;