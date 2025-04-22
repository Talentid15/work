import { useState, useEffect, useRef } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { GiRingingBell } from "react-icons/gi";
import { ImInfo } from 'react-icons/im';
import logo from '../assets/logo.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/UserSlice';
import { useDispatch } from 'react-redux';
import { useUserStore, useVerificationStore } from '../redux/userStore';
import toast from "react-hot-toast";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data || {});
  const { userId, verifiedDocuments } = useUserStore();
  const { setDocumentPopup } = useVerificationStore();

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  // Toggle profile dropdown
  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current && !notificationRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show verification banner based on document status
  const isDocumentPending = verifiedDocuments && !user?.verifiedDocuments;
  const isDocumentNotUploaded = !verifiedDocuments && !user?.verifiedDocuments;
  const isDocumentVerified = user?.verifiedDocuments === true;

  const handleVerificationClick = () => {
    if (!userId) {
      toast.error("Please log in to upload documents");
      navigate("/login");
      return;
    }
    setDocumentPopup(true, null, false);
  };

  return (
    <header className="bg-white px-6 py-4 relative z-10 border-b border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="TalentID Logo" className="h-8 w-32" />
        </div>
        
        <div className="flex items-center space-x-5">
          {/* Info Button */}
          <div className="relative group">
            <button className="p-2 rounded-full bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-700 transition-all duration-300 shadow-sm">
              <ImInfo className="text-lg" />
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-white opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 text-xs text-center p-2 rounded-md shadow-md pointer-events-none">
              Need help? Click here for information
            </div>
          </div>
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              className={`p-2 rounded-full ${showNotifications ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-700'} transition-all duration-300 shadow-sm`}
              onClick={toggleNotifications}
            >
              <FaBell className="text-lg" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                5
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform origin-top-right">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                  <p className="text-gray-800 font-semibold">Notifications</p>
                  <button 
                    className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                    onClick={() => setShowNotifications(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto py-4">
                  <div className='flex flex-col justify-center items-center space-y-4 p-6'>
                    <div className="bg-purple-50 rounded-full p-6">
                      <GiRingingBell size={60} className="text-purple-600" />
                    </div>
                    <p className="text-gray-800 font-medium">You have 5 new notifications</p>
                    <p className="text-gray-500 text-sm text-center">Check your notifications to stay updated on the latest activities</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <button className="w-full py-2 text-center text-sm text-purple-700 hover:text-purple-900 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              className={`flex items-center space-x-2 py-1.5 px-3 rounded-full ${showProfile ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-700'} transition-all duration-300 shadow-sm`}
              onClick={toggleProfile}
            >
              {user.userImage ? (
                <img src={user.userImage} alt="User" className="w-7 h-7 rounded-full" />
              ) : (
                <FaUserCircle className="w-7 h-7" />
              )}
              <span className="text-sm font-medium hidden sm:block">
                {user.fullname || "Profile"}
              </span>
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform origin-top-right">
                <div className="p-5 text-center border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                  <div className="relative mx-auto w-16 h-16 mb-3">
                    <img 
                      src={user.userImage || "https://via.placeholder.com/150"} 
                      alt="User" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-200" 
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <p className="text-gray-800 font-semibold">{user.fullname || "User Name"}</p>
                  <p className="text-gray-500 text-xs mt-1">{user.email || "user@example.com"}</p>
                </div>
                
                <ul className="py-2">
                  <li>
                    <button 
                      className="w-full flex items-center px-5 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
                      onClick={() => {
                        navigate("/settings");
                        setShowProfile(false);
                      }}
                    >
                      <FaUserCircle className="mr-3 text-purple-600" /> 
                      <span className="text-sm">My Profile</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      className="w-full flex items-center px-5 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
                      onClick={() => {
                        navigate("/settings/subscription");
                        setShowProfile(false);
                      }}
                    >
                      <MdOutlineCurrencyExchange className="mr-3 text-purple-600" /> 
                      <span className="text-sm">Subscription</span>
                    </button>
                  </li>
                  <li className="border-t border-gray-100 mt-1">
                    <button 
                      className="w-full flex items-center px-5 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => {
                        dispatch(logout());
                        navigate("/login");
                      }}
                    >
                      <FaSignOutAlt className="mr-3" /> 
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Verification Banner */}
      {!isDocumentVerified && (isDocumentPending || isDocumentNotUploaded) && (
        <div 
          className="mt-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-3 flex items-center justify-between cursor-pointer transition-all hover:from-amber-100 hover:to-yellow-100"
          onClick={handleVerificationClick}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-800 text-sm">
              {isDocumentPending
                ? "Your documents are being verified. Click to check status."
                : "Please upload documents to access all features. Click to upload."}
            </p>
          </div>
          <span className="text-yellow-600 text-xs font-medium underline">
            Action Required
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;