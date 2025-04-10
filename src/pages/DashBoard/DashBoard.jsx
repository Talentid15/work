import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import MultiLineChart from "./MultiLineChart";
import Card from "./Card";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "";

const DashBoard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const token = useSelector((state) => state.user.data?.token);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchOfferReleases = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/offer/get-all-offers`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const offers = response.data;
        // Count only offers where showOffer is true
        const offerReleasesCount = offers.filter(offer => offer.showOffer === true).length;

        setUserStats({
          fullname: user?.fullname || "User",
          interviewTrackingCredits: user?.credits ? `${user.credits}/1000` : "0/1000",
          offerPunchCount: "38", // Replace with API data if available
          offerReleases: `${offerReleasesCount}/20`, // Dynamic value from filtered API data
          candidateGhosting: "3/100", // Replace with API data if available
        });
      } catch (error) {
        console.error("Error fetching offer releases:", error);
        // Fallback stats in case of error
        setUserStats({
          fullname: user?.fullname || "User",
          interviewTrackingCredits: user?.credits ? `${user.credits}/1000` : "0/1000",
          offerPunchCount: "38",
          offerReleases: "0/20",
          candidateGhosting: "3/100",
        });
      }
    };

    if (token && user) {
      fetchOfferReleases();
    }
  }, [token, user]);

  if (!userStats) return <div className="text-center text-gray-500">Loading...</div>;

  const stats = [
    {
      title: "Interview Tracking Credits",
      value: userStats.interviewTrackingCredits,
      statusColor: "text-green-400",
      iconColor: "#34D399",
    },
    {
      title: "Number of Offer Punches",
      value: userStats.offerPunchCount,
      statusColor: "text-blue-400",
      iconColor: "#3B82F6",
    },
    {
      title: "Offer Letter Releases",
      value: userStats.offerReleases,
      statusColor: "text-yellow-400",
      iconColor: "#FBBF24",
    },
    {
      title: "Candidate Ghosting Alerts",
      value: userStats.candidateGhosting,
      statusColor: "text-red-400",
      iconColor: "#EF4444",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Welcome, <span className="text-indigo-600">{userStats.fullname}</span> 👋
            </h1>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                onClick={() => navigate("/offer-punch")}
              >
                <FaFileAlt />
                Offer Punch
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition duration-300 transform hover:scale-105"
                onClick={() => navigate("/release-offer")}
              >
                <FaFileAlt />
                Release Offer
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
              <Card
                key={index}
                {...item}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <MultiLineChart />
        </div>
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;