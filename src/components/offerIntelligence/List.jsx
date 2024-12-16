import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import photo from "../../assets/photo.png";
import BackButton from "../../assets/backButton.png";
import { NavLink } from "react-router-dom";

import { useNavigate } from "react-router-dom";

function CandidateList() {

  const navigate = useNavigate();

  const users = [
    {
      id: 1,
      name: "Soham",
      email: "alma.lawson@example.com",
      phone: "+91-6575757575",
      joiningDate: "17 July 2024",
      offerDate: "10th August 2024",
      status: "Active",
    },
    {
      id: 2,
      name: "Soham",
      email: "alma.lawson@example.com",
      phone: "+91-6575757575",
      joiningDate: "17 July 2024",
      offerDate: "10th August 2024",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Soham",
      email: "alma.lawson@example.com",
      phone: "+91-6575757575",
      joiningDate: "17 July 2024",
      offerDate: "10th August 2024",
      status: "Active",
    },
    {
      id: 4,
      name: "Soham",
      email: "alma.lawson@example.com",
      phone: "+91-6575757575",
      joiningDate: "17 July 2024",
      offerDate: "10th August 2024",
      status: "Active",
    },
    {
      id: 5,
      name: "Soham",
      email: "alma.lawson@example.com",
      phone: "+91-6575757575",
      joiningDate: "17 July 2024",
      offerDate: "10th August 2024",
      status: "Active",
    },
  ];

  return (
    <>
      <div className="flex flex-col w-full p-2">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <button className="text-gray-600 hover:text-gray-800">
              <img src={BackButton} alt="Back" className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-2">Candidate List</h1>
          </div>
          <button className="flex items-center gap-2 bg-[#652D96] text-white p-2 rounded-xl mr-4" onClick={()=>{

            navigate("addCandidate")

          }}>
            <AiOutlineUsergroupAdd className="h-5 w-5" />
            Add Candidate
          </button>

        </div>

        <div className="p-4 w-full mt-4">
          <div className="max-h-[590px] overflow-y-auto">
            <table className="w-full table-auto border-collapse rounded-md text-sm">
              {/* Table Header */}
              <thead>
                <tr className="bg-white text-center  text-gray-800 font-medium">
                  <th className="p-4 w-1/4">Details</th>
                  <th className="p-4">Offer Date</th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4">Personal Details</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="bg-[#EEEEEE]">
                    {/* Details */}
                    <td className="p-4">
                      <div className="flex items-center gap-4 bg-white p-2 rounded-md">
                        {/* User Image */}
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img
                            src={photo}
                            alt="Photo"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {/* User Info */}
                        <div>
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-lg text-gray-800">
                              {user.name}
                            </p>
                            <div
                              className={`flex items-center gap-2 font-semibold px-3 rounded-md ${
                                user.status === "Active"
                                  ? "bg-green-200 text-green-600"
                                  : "bg-red-200 text-red-600"
                              }`}
                            >
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: "currentColor" }}
                              ></div>
                              {user.status}
                            </div>
                          </div>
                          <p className="text-sm text-[#7C7C7C]">{user.email}</p>
                          <p className="text-sm text-[#7C7C7C]">{user.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Offer Date */}
                    <td className="p-4 text-center text-[#525151]">
                      {user.offerDate}
                    </td>

                    {/* Joining Date */}
                    <td className="p-4 text-center text-[#525151]">
                      {user.joiningDate}
                    </td>

                    {/* Personal Details */}
                    <td className="p-4 text-center">
                      <button className="bg-white text-black border border-gray-300 font-semibold px-3 py-1 rounded-full">
                        View more
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default CandidateList;
