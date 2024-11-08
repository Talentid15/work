import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { ImInfo } from "react-icons/im";
import logo from "../assets/logo.png"
const Header = () => {
    return (
        <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
            {/* Logo Section */}
            <div className="flex items-center">
                <img
                    src={logo}
                    alt="TalentID Logo"
                    className="h-8 w-auto"
                />
            </div>

            {/* Icons Section */}
            <div className="flex items-center space-x-6">
                <ImInfo className="text-gray-600 text-xl cursor-pointer" />
                <FaBell className="text-gray-600 text-xl cursor-pointer" />
                <FaUserCircle className="text-gray-600 text-2xl cursor-pointer" />

            </div>
        </header>
    );
};

export default Header;
