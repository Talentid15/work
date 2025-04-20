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
  const isDocumentNotUploaded = !verifiedDocuments;

  const handleVerificationClick = () => {
    if (!userId) {
      console.log("Header.jsx: No userId, redirecting to signup");
      toast.error("Please sign up to upload documents");
      navigate("/signup");
      return;
    }
    console.log("Header.jsx: Verification banner clicked, showing document popup, userId:", userId);
    setDocumentPopup(true, null, false);
  };

  console.log("Header.jsx: Rendering, verification status:", {
    userId,
    verifiedDocuments,
    userVerifiedDocuments: user?.verifiedDocuments,
    isDocumentPending,
    isDocumentNotUploaded,
  });

  return (
    <header className="flex flex-col bg-white shadow-md px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="TalentID Logo" className="h-8 w-auto" />
        </div>
        <div className="flex items-center space-x-6">
          <ImInfo className="text-gray-600 text-xl cursor-pointer hover:text-purple-900 transition duration-300" />
          <div className="relative" ref={notificationRef}>
            <FaBell
              className="text-gray-600 text-xl cursor-pointer hover:text-purple-900 transition duration-300"
              onClick={toggleNotifications}
            />
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 h-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-4 border-b">
                  <p className="text-gray-800 font-semibold">Notifications</p>
                  <FaTimes className="text-gray-600 cursor-pointer hover:text-red-500" onClick={() => setShowNotifications(false)} />
                </div>
                <div className='flex flex-col justify-center items-center space-x-2 mt-14'>
                  <GiRingingBell size={100} className="text-purple-600" />
                  <p className="text-gray-600 mt-1">You have 5 new notifications</p>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={profileRef}>
            <FaUserCircle
              className="text-gray-600 text-2xl cursor-pointer hover:text-purple-900 transition duration-300"
              onClick={toggleProfile}
            />
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-4 border-b">
                  <p className="text-gray-800 font-semibold">User Profile</p>
                  <FaTimes className="text-gray-600 cursor-pointer hover:text-red-500" onClick={() => setShowProfile(false)} />
                </div>
                <div className="p-4 text-center">
                  <img src={user.userImage} alt="User" className="w-16 h-16 rounded-full mx-auto" />
                  <p className="text-gray-800 font-semibold mt-2">{user.fullname}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                <ul className="space-y-2 p-2">
                  <li className="flex items-center text-gray-600 border-b hover:bg-gray-100 p-2 cursor-pointer" onClick={() => {
                    navigate("/settings");
                  }}>
                    <FaUserCircle className="mr-2" /> My Profile
                  </li>
                  <li className="flex items-center text-gray-600 border-b hover:bg-gray-100 p-2 cursor-pointer" onClick={() => {
                    navigate("/settings/subscription");
                  }}>
                    <MdOutlineCurrencyExchange className='mr-2' /> Subscription
                  </li>
                  <li className="flex items-center text-gray-600 hover:bg-gray-100 p-2 cursor-pointer" onClick={() => {
                    dispatch(logout());
                    navigate("/login");
                  }}>
                    <FaSignOutAlt className="mr-2 text-red-500" /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {(isDocumentPending || isDocumentNotUploaded) && (
        <div className="mt-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm text-center cursor-pointer" onClick={handleVerificationClick}>
          {isDocumentPending
            ? "Your documents are being verified. Click to check status."
            : "Please upload documents to access all features. Click to upload."}
        </div>
      )}
    </header>
  );
};

export default Header;