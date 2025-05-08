import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaFileAlt, FaPaperPlane } from "react-icons/fa";
import MultiLineChart from "./MultiLineChart";
import Card from "./Card";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import api from "../../utils/api";

const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";

const DashBoard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const token = useSelector((state) => state.user.data?.token);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const offerReleasesResponse = await api.get(`${API_URL}/api/offer/get-all-offers`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const offerPunchesResponse = await api.get(`${API_URL}/api/offer/get-offer-punches`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const offers = offerReleasesResponse.data;
        const offerPunches = offerPunchesResponse.data;

        const offerReleasesCount = offers.filter(offer => offer.showOffer === true).length;
        const offerPunchCount = offerPunches.length; 
        const offerGhostedCount = offers.filter(offer => offer.status === "Ghosted").length;

        setUserStats({
          fullname: user?.fullname || "User",
          interviewTrackingCredits: user?.credits ? `${user.credits}` : "0",
          offerPunchCount: `${offerPunchCount}`, 
          offerReleases: `${offerReleasesCount}`, 
          candidateGhosting:  `${offerGhostedCount}`, 
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setUserStats({
          fullname: user?.fullname || "User",
          interviewTrackingCredits: user?.credits ? `${user.credits}` : "0",
          offerPunchCount: "0", 
          offerReleases: "0",
          candidateGhosting: "0",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token && user) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [token, user]);

  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader />
    </div>
  );

  const stats = [
    {
      title: "Interview Tracking Credits",
      value: userStats.interviewTrackingCredits,
      statusColor: "text-green-500",
      iconColor: "#10B981",
      icon: "credits",
    },
    {
      title: "Number of Offer Punches",
      value: userStats.offerPunchCount,
      statusColor: "text-blue-500",
      iconColor: "#3B82F6",
      icon: "punches",
    },
    {
      title: "Offer Letter Releases",
      value: userStats.offerReleases,
      statusColor: "text-amber-500",
      iconColor: "#F59E0B",
      icon: "letters",
    },
    {
      title: "Candidate Ghosting Alerts",
      value: userStats.candidateGhosting,
      statusColor: "text-red-500",
      iconColor: "#EF4444",
      icon: "alerts",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-white p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-2">
                  Welcome back, <span className="text-[#74449D]">{userStats.fullname}</span>
                  <span className="animate-wave inline-block">👋</span>
                </h1>
                <p className="text-gray-500 mt-1">Here{"'"}s what{"'"}s happening with your account today.</p>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-[#74449D] to-[#4B2775] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm font-medium"
                  onClick={() => navigate("/offer-punch")}
                >
                  <FaFileAlt className="text-white/90" />
                  Offer Punch
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#74449D] text-[#74449D] rounded-lg shadow-sm hover:shadow-md hover:bg-purple-50 transition-all duration-300 text-sm font-medium"
                  onClick={() => navigate("/release-offer")}
                >
                  <FaPaperPlane className="text-[#74449D]/90" />
                  Release Offer
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((item, index) => (
                <Card
                  key={index}
                  {...item}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <MultiLineChart />
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;