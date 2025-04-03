import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaFileCircleQuestion, FaUserPlus } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUsers } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";

const InvitePage = () => {
    const [inviteEmail, setInviteEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.user.data || {});

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
                "http://localhost:4000/api/users/invite",
                { email: inviteEmail },
                { withCredentials: true },
                {
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
        <div className="flex-1 bg-white relative w-auto min-h-screen">
            <div className="w-full relative flex flex-col pt-9 md:flex-row align-start justify-between pb-5 px-10 border-b border-gray-300 mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                    <button className="flex items-center text-gray-800 focus:outline-none" >
                        <IoIosArrowBack className="text-2xl mr-4" onClick={() => {

                            navigate("/")

                        }} />
                        <span className="font-bold text-xl md:text-2xl">Invite Candidate</span>
                    </button>
                </div>

                <div className="flex justify-end items-center gap-4">
                    <Link to="/">
                        <button className="flex items-center px-4 py-2 bg-white font-semibold border-purple-600 rounded-full text-gray-800 hover:bg-gray-100 space-x-3 transition duration-200">
                            <HiOutlineUsers className="h-5 w-5" />
                            <span>Track Candidate</span>
                        </button>
                    </Link>

                    <Link to="/history">
                        <button
                            className={`flex items-center gap-2 px-5 py-2 font-medium text-sm rounded-full transition-all duration-300 ${"text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                                }`}
                        >
                            <FaFileCircleQuestion className="h-5 w-5" />
                            History
                        </button>
                    </Link>
                    <Link to="/invite">
                        <button
                            className={`flex items-center bg-purple-900 text-white gap-2 px-5 py-2 font-medium text-sm rounded-full transition-all duration-300 ${"text-gray-700 hover:shadow-sm"
                                }`}
                        >
                            <FaUserPlus className="h-5 w-5" />
                            Invites
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center min-h-screen p-4 -mt-40">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
                        Invite a Candidate
                    </h1>
                    <div className="flex flex-col space-y-4">
                        <input
                            type="email"
                            placeholder="Enter email address to invite"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                            onKeyPress={(e) => e.key === "Enter" && handleInvite()}
                        />
                        <button
                            onClick={handleInvite}
                            className="px-6 py-3 bg-[#803CD8] text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition duration-200"
                        >
                            Send Invite
                        </button>
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default InvitePage;