import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

const SearchHistoryTable = ({users}) => {


  return (
    <table className="w-full h-[300px] p-6 border-collapse border border-gray-200 rounded-lg text-sm">
      <thead>
        <tr className="bg-white text-left text-black-600 font-medium text-base font-sans">
          <th className="p-5 w-[40%]">User Details</th>
          <th className="p-5 w-[30%]">Joining</th>
          <th className="p-5 w-[20%]">Actions</th>
        </tr>
      </thead>
      <tbody className="overflow-y-auto max-h-[200px]">
        {users.map((user) => (
          <tr key={user.id}>
            {/* User Details */}
            <td className="p-4 mt-5 ml-3 flex flex-col bg-white border border-gray-300 h-full rounded-2xl">
              <span className="font-bold text-lg text-gray-800">{user.name}</span>
              <span className="text-[#7C7C7C] text-sm">{user.email}</span>
              <span className="text-[#7C7C7C] text-sm">{user.phone}</span>
              <span className="w-[50%] mt-5 bg-[#3DBF284F] text-black-600 w-full text-xs font-semibold py-1 p-2 rounded-md">
                Staff ID: {user.staffId}
              </span>
            </td>

            {/* Joining Date */}
            <td className="p-6 text-[#838383] font-semibold text-sm">{user.joiningDate}</td>

            {/* Actions */}
            <td className="p-6 flex items-center content-center gap-2">
              <button className="text-black-500 hover:text-purple-600" aria-label="Edit">
                <FaRegEdit size={18} />
              </button>
              <button className="text-black-500 hover:text-red-600" aria-label="Delete">
                <RiDeleteBin6Line size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SearchHistoryTable;
