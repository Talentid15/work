import { Link, useLocation } from "react-router-dom";
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion, FaUserPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Navbar = () => {
  const location = useLocation();
  const active = location.pathname === "/" ? "People" : location.pathname === "/history" ? "history" : "Invite";
  const { credits } = useSelector((state) => state.user.data || {});

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 shadow-lg">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-[#74449E] to-[#803CD8] text-white px-4 py-2 rounded-full shadow-md">
          <p className="text-sm font-semibold">Credits: {credits || 0}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-full shadow-md">
        <Link to="/">
          <button
            className={`flex items-center gap-2 px-5 py-2 font-medium text-sm rounded-full transition-all duration-300 ${
              active === "People"
                ? "bg-[#74449E] text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            <HiOutlineUsers className="h-5 w-5" />
            Track Candidate
          </button>
        </Link>
        <Link to="/history">
          <button
            className={`flex items-center gap-2 px-5 py-2 font-medium text-sm rounded-full transition-all duration-300 ${
              active === "history"
                ? "bg-[#74449E] text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            <FaFileCircleQuestion className="h-5 w-5" />
            History
          </button>
        </Link>
        <Link to="/invite">
          <button
            className={`flex items-center gap-2 px-5 py-2 font-medium text-sm rounded-full transition-all duration-300 ${
              active === "Invite"
                ? "bg-[#74449E] text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            <FaUserPlus className="h-5 w-5" />
            Invite
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;