import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setOfferData } from "../../redux/offerSlice";
import { formateDate } from "../../utils";

const Job_Offer = () => {
  const offersData = useSelector((state) => state.offer.data); // Access offer data from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';
  const token = useSelector((state) => state.user.data?.token); // Access token from Redux

  useEffect(() => {
    const fetchOffersData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/offer/get-all-offers`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched Offers Data:", response.data);
          dispatch(setOfferData(response.data));
      } catch (error) {
        console.error("Error fetching offers data:", error);
        setError("Failed to fetch offers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffersData();
  }, [dispatch, token]); // Added token as dependency to refetch if token changes

  const handleSendEmail = async (offerId) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/offer/send-offer-email/${offerId}`,
        {},
        { withCredentials: true }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  };

  const statusOptions = [
    "All",
    "Pending",
    "Accepted",
    "Declined",
    "OnBoarding",
    "Ghosted",
    "Expired",
    "Offer letter released",
    "Retracted"
  ];

  // Filter out offers where showOffer is false
  const visibleOffers = offersData?.filter(offer => offer.showOffer !== false);
  const filteredOffers =
    statusFilter === "All"
      ? visibleOffers
      : visibleOffers?.filter((offer) => offer.status === statusFilter);

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <select
          className="px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          className="flex items-center gap-2 px-6 py-2 bg-[#5C3386] text-white rounded-full shadow-md hover:bg-purple-900 transition-all"
          onClick={() => navigate("/release-offer")}
        >
          <FaFileAlt />
          Release an Offer
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading offers...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filteredOffers?.length > 0 ? (
        <div className="overflow-x-auto border rounded-xl my-6 hidden md:block">
          <table className="w-full bg-white rounded-lg">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Offer Letter</th>
                <th className="p-4 text-left">Date Added</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map((offer) => (
                <tr key={offer._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">{offer?.candidate?.name || "N/A"}</td>
                  <td className="p-4">{offer?.candidate?.email || "N/A"}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-sm">
                      {offer.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-sm">
                      {offer.offerLetterStatus}
                    </span>
                  </td>
                  <td className="p-4">{formateDate(offer.offerDate) || "N/A"}</td>
                  <td className="p-4 flex items-center justify-center space-x-3">
                    {offer.status === "Pending" && (
                      <button
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                        onClick={() => handleSendEmail(offer._id)}
                        title="Send Offer Email"
                      >
                        <MdMarkEmailUnread size={20} />
                      </button>
                    )}
                    <button
                      className="text-white bg-purple-700 px-4 py-2 rounded-full text-sm hover:bg-purple-900 transition-all"
                      onClick={() => navigate(`/joboffers/${offer._id}`)}
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No offers available.</p>
      )}

      <div className="block md:hidden">
        {loading ? (
          <div className="text-center text-gray-500">Loading offers...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredOffers?.length > 0 ? (
          filteredOffers.map((offer) => (
            <div key={offer._id} className="mb-5 p-5 border rounded-lg shadow-md bg-white">
              <p className="font-semibold text-lg text-purple-800">
                {offer?.candidate?.name || "N/A"}
              </p>
              <p className="text-gray-600">{offer?.candidate?.email || "N/A"}</p>
              <p className="text-gray-500">
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                  {offer.status || "Pending"}
                </span>
              </p>
              <p className="text-sm text-gray-400">{formateDate(offer.offerDate) || "N/A"}</p>
              <div className="mt-3 flex space-x-3">
                {offer.status === "Pending" && (
                  <button
                    className="text-sm bg-purple-700 text-white px-4 py-1 rounded-lg hover:bg-purple-900 transition"
                    onClick={() => handleSendEmail(offer._id)}
                  >
                    Send Email
                  </button>
                )}
                <button
                  className="text-white bg-purple-700 px-4 py-1 rounded-lg text-sm hover:bg-purple-900 transition-all"
                  onClick={() => navigate(`/joboffers/${offer._id}`)}
                >
                  View More
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No offers available.</p>
        )}
      </div>

      <div className="flex flex-col justify-center items-center p-5 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Job_Offer;