import {
  FaUserFriends,
  FaClipboardCheck,
  FaFileSignature,
  FaBoxes,
  FaChartLine,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="bg-purple-600 text-white w-64 p-6 space-y-6">
      <div className="text-2xl font-bold text-center mb-4">TalentID</div>
      <nav className="space-y-4">
        <a
          href="#"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-700"
        >
          <FaUserFriends />
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-700"
        >
          <FaClipboardCheck />
          <span>Candidate tracking system</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-700"
        >
          <FaFileSignature />
          <span>Background checks</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-700"
        >
          <FaBoxes />
          <span>Offer intelligence</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-700"
        >
          <FaUserCog />
          <span>Onboarding</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-700"
        >
          <FaChartLine />
          <span>Asset Management</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-700"
        >
          <FaSignOutAlt />
          <span>Performance Management</span>
        </a>
      </nav>
      <div className="mt-auto">
        <button className="w-full flex items-center space-x-2 p-2 rounded-md bg-purple-700 hover:bg-purple-800">
          <span>Support</span>
        </button>
        <button className="w-full flex items-center space-x-2 p-2 mt-2 rounded-md bg-purple-700 hover:bg-purple-800">
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
