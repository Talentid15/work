import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { differenceInDays, isBefore } from "date-fns";

import photo from "../../assets/photo.png";
import BackButton from "../../assets/backButton.png";
import { Dateformatter } from "../../utils";

const API_URL = import.meta.env.VITE_REACT_BACKEND_URL?? '';


// Fetch Candidate Data from API
const fetchCandidateData = async () => {
  const response = await axios.get(`${API_URL}/api/candidate/fetchAllCandidate`, {
    withCredentials: true,
  });
  return response.data.data; // Return the correct data structure
};

function CandidateList() {
  const navigate = useNavigate();

  // Fetch data with React Query
  const { data: candidates, isLoading, error } = useQuery({
    queryKey: ["candidateData"],
    queryFn: fetchCandidateData,
  });

  return (
    <div className="flex flex-col w-full h-[90vh] p-6 bg-gray-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Back Button */}
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
            <img src={BackButton} alt="Back" className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold ml-2 text-gray-800">Candidate List</h1>
        </div>

        {/* Add Candidate Button */}
        <button
          className="flex items-center gap-2 bg-[#652D96] text-white px-4 py-2 rounded-xl hover:bg-[#501f75] transition"
          onClick={() => navigate("addCandidate")}
        >
          <AiOutlineUsergroupAdd className="h-5 w-5" />
          Add Candidate
        </button>
      </div>

      {/* Loading & Error Handling */}
      {isLoading && <p className="text-center text-gray-600 mt-4">Loading candidates...</p>}
      {error && <p className="text-center text-red-600 mt-4">Error loading candidates.</p>}

      {/* Candidates Table */}
      <div className="p-4 w-full mt-4 bg-white shadow-md rounded-md">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200 text-center text-gray-800 font-medium">
                <th className="p-4 w-1/4">Details</th>
                <th className="p-4">Offer Date</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4">Engagement Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates &&
                candidates.map((user) => {
                  // const offerDate = new Date(user.offerDate);
                  const joiningDate = new Date(user.joiningDate);
                  const today = new Date();

                  const daysDifference = differenceInDays(joiningDate, today);
                  const isExpired = isBefore(joiningDate, today);

                  return (
                    <tr key={user.id} className="bg-gray-100 border-b">
                      {/* Candidate Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-4 bg-white p-2 rounded-md">
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <img src={photo} alt="Candidate" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg text-gray-800">{user.candidate.name}</p>
                            <p className="text-sm text-gray-600">{user.candidate.email}</p>
                            <p className="text-sm text-gray-600">{user.candidate.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Offer Date */}
                      <td className="p-4 text-center text-gray-700">
                        {Dateformatter(user.offerDate)}
                      </td>

                      {/* Joining Date */}
                      <td className="p-4 text-center text-gray-700">
                        {Dateformatter(user.joiningDate)}
                      </td>

                      {/* Engagement Status */}
                      <td className="p-4 text-center">
                        {isExpired ? (
                          <span className="text-red-600 font-semibold">Offer Expired</span>
                        ) : user.isEngagementStart ? (
                          <span className="text-green-600 font-semibold">Engagement Started</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">Pending</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        {isExpired ? (
                          <span className="text-gray-400">No Actions</span>
                        ) : !user.isEngagementStart && daysDifference >= 0 ? (
                          <button
                            onClick={() => console.log("Start Engagement")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                          >
                            Start Engagement
                          </button>
                        ) : (
                          <button
                            onClick={() => console.log("Stop Engagement")}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                          >
                            Stop Engagement
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Small Screen View */}
      <div className="sm:hidden block w-full mt-4">
        {candidates &&
          candidates.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img src={photo} alt="User" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{user.candidate.name}</h2>
                  <p className="text-sm text-gray-600">{user.candidate.email}</p>
                  <p className="text-sm text-gray-600">{user.candidate.phone}</p>
                </div>
              </div>
              <p className="mt-2 text-sm">
                <strong>Offer Date:</strong> {Dateformatter(user.offerDate)}
              </p>
              <p className="text-sm">
                <strong>Joining Date:</strong> {Dateformatter(user.joiningDate)}
              </p>
              <button className="mt-4 w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-md">
                View More
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CandidateList;
