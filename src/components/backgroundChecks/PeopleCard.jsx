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
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    },
    {
      id: 2,
      name: "Soham",
      position: "Manager",
      staffId: "158586",
      joiningDate: "17 Oct 2024",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    },
    {
      id: 2,
      name: "Soham",
      position: "Manager",
      staffId: "158586",
      joiningDate: "17 Oct 2024",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    },
    {
      id: 2,
      name: "Soham",
      position: "Manager",
      staffId: "158586",
      joiningDate: "17 Oct 2024",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    },
    // Add more user objects as needed
  ];

  return (
    <div className="p-4 w-full">
      {/* Container with fixed height and scrollable content */}
      <div className="h-[500px] overflow-y-auto border border-gray-300 rounded-md">
        <table className="table-fixed w-full">
          <thead className="bg-white text-gray-800 font-medium">
            <tr>
              <th className="w-1/3 p-4 border-b border-gray-300 text-center">Details</th>
              <th className="w-1/4 p-4 border-b border-gray-300 text-center">Current Address</th>
              <th className="w-1/3 p-4 border-b border-gray-300 text-center">Verifications</th>
              <th className="w-1/4 p-4 border-b border-gray-300 text-center">Documents</th>
              <th className="w-1/4 p-4 border-b border-gray-300 text-center">Pipeline</th>
            </tr>
          </thead>
          <tbody className="bg-[#EEEEEE]">
            {users.map((user) => (
              <tr key={user.id} className="">
                <td className="p-4 text-center">
                  <div className="flex items-center border gap-4 bg-white p-2 rounded-md">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src={photo}
                        alt="Photo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="items-start flex flex-col">
                      <p className="font-medium text-xl text-black-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.position}</p>
                      <p className="text-sm text-gray-600">Staff Id: {user.staffId}</p>
                      <p className="mt-1 text-[10px] bg-[#3DBF284F] font-semibold text-black-800 px-2 py-0 rounded">
                        Joined: {user.joiningDate}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[#838383] text-center">{user.address}</td>
                <td className="p-4 text-center">
                  <Verification />
                </td>
                <td className="p-4 text-center">
                  <button className="bg-white p-2 px-4 border border-gray-300 font-medium rounded-full">Upload +</button>
                </td>
                <td className="p-4 text-center">
                  <button className="bg-white border border-gray-300 text-black px-3 py-1 rounded-full">
                    View more
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeopleCard;
