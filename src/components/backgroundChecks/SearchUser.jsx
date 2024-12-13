import React from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const SearchHistoryTable = () => {
  const users = [
    {
      id: 1,
      name: "Soham",
      email: "alma.lawson@example.com",
      phone: "+91-6575757575",
      staffId: "581515",
      joiningDate: "October 30, 2017",
    },
    {
      id: 2,
      name: "Soham",
      email: "alma.lawson@example.com",
      phone: "+91-6575757575",
      staffId: "581515",
      joiningDate: "October 30, 2017",
    },
    {
      id: 3,
      name: "Soham",
      email: "alma.lawson@example.com",
      phone: "+91-6575757575",
      staffId: "581515",
      joiningDate: "October 30, 2017",
    },
  ];

  return (
      <table className="w-full p-6 border-collapse border border-gray-200 shadow-lg rounded-lg text-sm">
        <thead>
          <tr className="bg-white text-left text-gray-600 font-medium">
            <th className="p-4">User Details</th>
            <th className="p-4">Joining</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              {/* User Details */}
              <td className="p-4 m-2 flex flex-col bg-white shadow h-full rounded">
                <span className="font-medium text-gray-800">{user.name}</span>
                <span className="text-gray-500 text-sm">{user.email}</span>
                <span className="text-gray-500 text-sm">{user.phone}</span>
                <span className="mt-10 bg-[#3DBF284F] text-black-600 w-full text-xs px-2 py-1 rounded-md">
                  Staff ID: {user.staffId}
                </span>
              </td>

              {/* Joining Date */}
              <td className="p-4 text-gray-600">{user.joiningDate}</td>

              {/* Actions */}
              <td className="p-4 flex items-center gap-4">
                <button
                  className="text-gray-500 hover:text-purple-600"
                  aria-label="Edit"
                >
                  <FiEdit size={18} />
                </button>
                <button
                  className="text-gray-500 hover:text-red-600"
                  aria-label="Delete"
                >
                  <FiTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  );
};

export default SearchHistoryTable;
