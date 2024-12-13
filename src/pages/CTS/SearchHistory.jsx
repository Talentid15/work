import React from 'react';
import ellipse from "../../assets/ellipse.png"
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';

const SearchHistory = () => {
  const candidates = [
    { profile: ellipse, name: "Jainayak N", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
  ];

  return (
    <div className="flex-1 p-8">
        <div className="w-full flex align-start justify-between pb-5">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button className="flex items-center text-gray-800 focus:outline-none">
        <IoIosArrowBack className="text-xl mx-4" />
          <span className="font-semibold text-xl">Search History</span>
        </button>
      </div>


      <div className="w-auto max-w-[330px] ml-auto flex justify-end items-center mb-2 bg-white rounded-full p-2">
        <div className="flex items-center">
        <Link to="/">
          <button className="flex items-center px-3 py-2 bg-white  font-semibold rounded-full  text-gray-800  hover:bg-gray-100  space-x-3 transition duration-200">
            <HiOutlineUsers className="h-5 w-5" />
            <span>Track Candidate</span>
          </button>
          </Link>

          
            <button className="flex items-center px-5 py-2 bg-[#74449E] text-white  rounded-full hover:bg-[#5a2889] space-x-3 transition duration-200">
              <FaFileCircleQuestion className="h-5 w-5" />
              <span>History</span>
            </button>
        </div>
      </div>

        </div>



      {/* Table */}
      <div className="h-[550px] overflow-y-auto">
      <table className="w-full bg-gray-100 shadow-lg rounded-xl ">
        <thead>
          <tr className="bg-white text-gray-700 text-left text-sm font-semibold py-7">
            <th className="ps-10 py-7 text-md">Profile</th> 
            <th className="px-2 py-7 text-md">Name</th>    
            <th className="px-2 py-7 text-md">Email</th>   
            <th className="px-2 py-7 text-md">Last Searched on</th> 
            <th className="px-2 py-7 text-md">View pipeline</th>   
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={index} className="border-b last:border-none hover:bg-gray-50">
              <td className="ps-10 py-2">
                <img src={candidate.profile} alt="profile" className="w-10 h-10 rounded-full border-2 border-gray-300" />
              </td>
              <td className="px-2 py-2 text-sm font-medium text-gray-800">{candidate.name}</td>
              <td className="px-2 py-2 text-sm text-gray-600">{candidate.email}</td>
              <td className="px-2 py-2 text-sm text-gray-600">{candidate.lastSearched}</td>
              <td className="px-2 py-2">
                <button className="text-sm text-gray-700 border border-gray-300 rounded-full px-3 py-1 font-medium hover:bg-gray-100 focus:ring-2 focus:ring-purple-500">
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


export default SearchHistory;
