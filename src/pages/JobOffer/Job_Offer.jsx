import React,{ useState } from 'react'
import { Outlet } from 'react-router-dom'
import { MdMarkEmailUnread } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
const Job_Offer = () => {
    const navigate = useNavigate();
      const [users, setUsers] = useState([
        {
          id: 1,
          name: "Jainayak N",
          email: "jai@talentid.app",
          status: "Onboarding",
          date: "Jan 8, 2025",
        },
        {
          id: 2,
          name: "Jainayak N",
          email: "jai@talentid.app",
          status: "Ghosted",
          date: "Jan 8, 2025",
        },
        {
          id: 3,
          name: "Jainayak N",
          email: "jai@talentid.app",
          status: "Expired",
          date: "Jan 8, 2025",
        },
        {
          id: 4,
          name: "Jainayak N",
          email: "jai@talentid.app",
          status: "Onboarding",
          date: "Jan 8, 2025",
        },
        {
          id: 5,
          name: "Jainayak N",
          email: "jai@talentid.app",
          status: "Declined",
          date: "Jan 8, 2025",
        },
      ]);
    
      const handleDelete = (id) => {
        setUsers(users.filter((user) => user.id !== id));
      };

  return (
     <div>
      <div className="w-full max-w-5xl mx-auto mt-5 p-4 bg-white rounded-xl shadow-lg">
            {/* Add Users Button */}
            <div className="flex justify-end items-end mb-4">
              <button
                      className="flex items-center gap-2 px-5 py-2 bg-purple-900 text-white rounded-full shadow-md hover:bg-gradient-to-t from-purple-300 to-purple-600 hover:text-black transition-all"
                      onClick={() => navigate("/release-offer")}
                    >
                      <FaFileAlt />
                      Release an Offer
                    </button>
            </div>
      
            {/* Table for large screens */}
            <div className="overflow-x-auto hidden border rounded-2xl my-10 md:block">
              <table className="w-full bg-white rounded-lg">
                <thead>
                  <tr className="border-b ">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">User Role</th>
                    <th className="p-3 text-left">Date Added</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-gray-200 rounded-full">{user.status}</span>
                      </td>
                      <td className="p-3">{user.date}</td>
                      <td className="p-3 flex items-center space-x-2">
                        <button className="bg-white px-3 py-1 rounded-full"><MdMarkEmailUnread size={20} /></button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 text-xl pr-2">🗑</button>
                        <button  className="text-white bg-purple-900 rounded-full text-sm px-2 py-2 hover:bg-slate-300 hover:text-black ">View More</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      
            {/* Vertical cards for small screens */}
            <div className="block md:hidden">
              {users.map((user) => (
                <div key={user.id} className="mb-4 p-4 border rounded-lg shadow-md bg-gray-50">
                  <p className="font-semibold text-lg">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-500">
                    <span className="px-2 py-1 bg-gray-200 rounded-full">{user.status}</span>
                  </p>
                  <p className="text-sm text-gray-400">{user.date}</p>
                  <div className="mt-2 flex space-x-2">
                    <button className="bg-gray-300 px-3 py-1 rounded-full">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600">🗑</button>
                  </div>
                </div>
              ))}
            </div>
      
            
          </div>
        <div className="flex flex-col justify-center items-center p-3 md:p-5 w-full">
        <Outlet />
        </div>
    </div>
  )
}

export default Job_Offer