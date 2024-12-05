import React from "react";
import photo from "../../assets/photo.png";
import Verification from "./Verification";

const PeopleCard = () => {
  const users = [
    {
      id: 1,
      name: "Soham",
      position: "Manager",
      staffId: "158585",
      joiningDate: "17 Oct 2024",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063"
    },
    {
      id: 2,
      name: "Soham",
      position: "Manager",
      staffId: "158585",
      joiningDate: "17 Oct 2024",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063"
    },
    {
      id: 3,
      name: "Soham",
      position: "Manager",
      staffId: "158585",
      joiningDate: "17 Oct 2024",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063"
    },
  ];

  return (
    <div className="p-4 w-full">
      <table className="w-full table-auto border-collapse border border-gray-300  rounded-md text-sm">
        {/* Table Header */}
        <thead>
          <tr className="bg-white text-left text-gray-800 font-medium">
            <th className="p-4">Details</th>
            <th className="p-4">Current Address</th>
            <th className="p-4">Verifications</th>
            <th className="p-4">Documents</th>
            <th className="p-4">Pipeline</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-300 bg-[#EEEEEE]">
              {/* Details */}
              <td className="p-4 border border-gray-300">
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
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.position}</p>
                    <p className="text-sm text-gray-600">
                      Staff Id: {user.staffId}
                    </p>
                    <p className="mt-1 text-[10px] bg-[#3DBF284F] text-gray-800 px-2 py-0 rounded">
                      Joined: {user.joiningDate} 
                    </p>
                  </div>
                </div>
              </td>

              {/* Current Address */}
              <td className="p-4 border text-[#838383]">{user.address}</td>

              {/* Verifications */}
              <td className="p-4 border text-center">
                <div>
                  <Verification />
                </div>
              </td>

              {/* Documents */}
              <td className="p-4 border text-center"> <Verification/> </td>

              {/* Pipeline */}
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
  );
};

export default PeopleCard;
