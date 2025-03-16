import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setOfferData } from "../../redux/offerSlice";

import { formateDate } from "../../utils";

const Job_Offer = () => {
  const offersData = useSelector((state) => state.offer.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchOffersData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/offer/get-all-offers", {
          withCredentials: true,
        });

        console.log("Fetched Offers Data:", response.data);
        dispatch(setOfferData(response.data));
      } catch (error) {
        console.error("Error fetching offers data:", error);
      }
    };

    fetchOffersData();
  }, []);

  const handleDelete = (id) => {
    dispatch(setOfferData(offersData.filter((offer) => offer._id !== id)));
  };

  const statusOptions = ["All", "Pending", "Accepted", "Declined", "OnBoarding", "Ghosted", "Expired","Offer letter released"];

  const filteredOffers = statusFilter === "All"
    ? offersData
    : offersData?.filter((offer) => offer.status === statusFilter);

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
      {/* Top Bar: Release Offer Button & Filter Dropdown */}
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

      {/* Offer Table for Larger Screens */}
      {filteredOffers?.length > 0 ? (
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
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                      <MdMarkEmailUnread size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(offer._id)}
                      className="text-red-600 text-xl p-2 hover:bg-red-100 rounded-full"
                    >
                      🗑
                    </button>
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

      {/* Offer Cards for Small Screens */}
      <div className="block md:hidden">
        {filteredOffers?.length > 0 ? (
          filteredOffers.map((offer) => (
            <div key={offer._id} className="mb-5 p-5 border rounded-lg shadow-md bg-white">
              <p className="font-semibold text-lg text-purple-800">{offer?.candidate?.name || "N/A"}</p>
              <p className="text-gray-600">{offer?.candidate?.email || "N/A"}</p>
              <p className="text-gray-500">
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">{offer.status || "Pending"}</span>
              </p>
              <p className="text-sm text-gray-400">{formateDate(offer.offerDate) || "N/A"}</p>
              <div className="mt-3 flex space-x-3">
                <button className="text-sm bg-purple-700 text-white px-4 py-1 rounded-lg hover:bg-purple-900 transition">
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(offer._id)}
                  className="text-red-600 text-lg hover:bg-red-100 px-3 py-1 rounded-lg transition"
                >
                  🗑
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
