import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import photo from "../../assets/photo.png";
import BackButton from "../../assets/backButton.png";
import { NavLink } from "react-router-dom";

function CandidateList() {
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
          <NavLink to="/offerIntelligence/profileUpdate" >
          <button className="flex items-center gap-2 bg-[#652D96] text-white p-2 rounded-xl mr-4">
            <AiOutlineUsergroupAdd className="h-5 w-5" />
            Add Candidate
          </button>
          </NavLink>
        </div>

        <div className="p-4 w-full mt-4">
          <table className="w-full table-auto border-collapse border border-gray-300  rounded-md text-sm">
            {/* Table Header */}
            <thead>
              <tr className="bg-white text-center text-left text-gray-800 font-medium">
                <th className="p-4">Details</th>
                <th className="p-4">Offer Date</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4">Personal Details</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-300 bg-[#EEEEEE]"
                >
                  {/* Details */}
                  <td
                    className="p-4"
                  >
                    <NavLink to="/offerIntelligence/profile">
                    <div className="inline-flex items-center gap-4 bg-white p-2 rounded-md">
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
                        <div className="flex gap-14 ">
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <div
                            className={
                              user.status == "Active"
                                ? "flex bg-green-200 text-green-600 px-3 rounded-md gap-2"
                                : "flex bg-red-200 text-red-600 px-3 rounded-md gap-2"
                            }
                          >
                            <div className="h-2 w-2 rounded-full mt-1.5"  style={{ backgroundColor: "currentColor" }}></div>
                            {user.status}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      </div>
                    </div>
                    </NavLink>
                  </td>

                  {/* offer date */}
                  <td className="p-4 border text-[#838383]">
                    {user.offerDate}
                  </td>

                  {/* joining date */}
                  <td className="p-4 border text-center">{user.joiningDate}</td>

                  {/* personal details */}
                  <td className="p-4 border text-center">
                    <button className="bg-white text-black px-3 py-1 rounded-full">
                      View more
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CandidateList;