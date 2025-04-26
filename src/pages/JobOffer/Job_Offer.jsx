import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import { setOfferData } from "../../redux/offerSlice";
import { formateDate } from "../../utils";
import api from "../../utils/api";
import Loader from "../../components/common/Loader";

const Job_Offer = () => {
  const offersData = useSelector((state) => state.offer.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';
  const token = useSelector((state) => state.user.data?.token);
  const data = useSelector((state) => state.user.data);

  useEffect(() => {
    const fetchOffersData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`${API_URL}/api/offer/get-all-offers`, {
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
  }, [dispatch, token]);

  const handleSendEmail = async (offerId) => {
    try {
      const response = await api.post(
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
    "Ghosted",
    "Expired",
    "Retracted"
  ];

  const visibleOffers = offersData?.filter(offer => offer.showOffer !== false);
  const filteredOffers =
    statusFilter === "All"
      ? visibleOffers
      : visibleOffers?.filter((offer) => offer.status === statusFilter);

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-6">Job Offers Dashboard</h1>
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <select
            className="w-full sm:w-48 px-4 py-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-700"
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
            className="flex items-center gap-2 px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all shadow-md w-full sm:w-auto justify-center sm:justify-start"
            onClick={() => navigate("/release-offer")}
          >
            <FaFileAlt />
            Release an Offer
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium py-8">{error}</div>
        ) : filteredOffers?.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full bg-white">
                <thead className="bg-purple-50 text-purple-800">
                  <tr>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Name</th>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Role</th>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Status</th>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Offer Letter</th>
                    <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Date Added</th>
                    <th className="p-4 text-center font-semibold text-sm uppercase tracking-wide min-w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((offer) => (
                    <tr
                      key={offer._id}
                      className="border-b hover:bg-purple-50 transition-all"
                    >
                      <td className="p-4 text-gray-700">{offer?.candidate?.name || "N/A"}</td>
                      <td className="p-4 text-gray-700">{offer?.jobTitle || "N/A"}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {offer.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {data.company}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700">{formateDate(offer.offerDate) || "N/A"}</td>
                      <td className="p-4 flex items-center justify-center gap-3">
                        {offer.status === "Pending" ? (
                          <button
                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                            onClick={() => handleSendEmail(offer._id)}
                            title="Send Offer Email"
                          >
                            <MdMarkEmailUnread className="text-purple-600" size={20} />
                          </button>
                        ) : (
                          <div className="w-10 h-10 flex-shrink-0" /> // Placeholder for alignment
                        )}
                        <button
                          className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all text-sm font-medium"
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

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredOffers.map((offer) => (
                <div
                  key={offer._id}
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-semibold text-purple-800">
                    {offer?.candidate?.name || "N/A"}
                  </h3>
                  <p className="text-gray-600 mt-1">{offer?.candidate?.email || "N/A"}</p>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {offer.status}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {offer.offerLetterStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    {formateDate(offer.offerDate) || "N/A"}
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-start">
                    {offer.status === "Pending" ? (
                      <button
                        className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all text-sm font-medium flex items-center gap-2"
                        onClick={() => handleSendEmail(offer._id)}
                      >
                        <MdMarkEmailUnread size={16} />
                        Send Email
                      </button>
                    ) : (
                      <div className="w-0 sm:w-28 h-10 flex-shrink-0" /> // Placeholder for alignment
                    )}
                    <button
                      className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all text-sm font-medium"
                      onClick={() => navigate(`/joboffers/${offer._id}`)}
                    >
                      View More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 font-medium py-8">No offers available.</p>
        )}

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Job_Offer;