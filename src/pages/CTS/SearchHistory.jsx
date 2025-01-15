import React, { useEffect, useState } from "react";
import ellipse from "../../assets/ellipse.png";
import { HiOutlineUsers } from "react-icons/hi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { Link, Navigate, useNavigate } from "react-router-dom";

const SearchHistory = () => {

  const navigate = useNavigate();

  const [userHistoryData,setUserHistoryData] = useState(null);

  useEffect(()=>{
    
      async function fetchUserHistoryData(){

        try {
          const response = await fetch("http://localhost:4000/api/users/getUserHistoryData/67494527994341a870ceaf7b");
          const data = await response.json();

          console.log(data);
          // setUserHistoryData(data);
        } catch (error) {
          console.error(error);
        }
      }

      fetchUserHistoryData();

  },[])

  const candidates = [
    { profile: ellipse, name: "Jainayak N", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Jainayak N", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Jainayak N", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Jainayak N", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Jainayak N", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    { profile: ellipse, name: "Devon Lane", email: "debra.holt@example.com", lastSearched: "1:38 PM Feb 9, 2015" },
    // ...additional candidates
  ];

  return (
    <div className="relative h-full overflow-hidden p-6 md:p-8 flex flex-col bg-white ">
      {/* Header */}
      <div className="w-full relative flex flex-col md:flex-row align-start justify-between pb-5 border-b border-gray-300 mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button className="flex items-center text-gray-800 focus:outline-none" >
            <IoIosArrowBack className="text-2xl mr-4" onClick={()=>{

              navigate("/")

            }}/>
            <span className="font-bold text-xl md:text-2xl">Search History</span>
          </button>
        </div>

        <div className="flex justify-end items-center gap-4">
          <Link to="/">
            <button className="flex items-center px-4 py-2 bg-white font-semibold border-purple-600 rounded-full text-gray-800 hover:bg-gray-100 space-x-3 transition duration-200 shadow-md">
              <HiOutlineUsers className="h-5 w-5" />
              <span>Track Candidate</span>
            </button>
          </Link>

          <button className="flex items-center px-5 py-2 bg-[#74449E] text-white rounded-full hover:bg-[#5a2889] space-x-3 transition duration-200 shadow-md">
            <FaFileCircleQuestion className="h-5 w-5" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative h-[30rem]">
        <table className="w-full relativebg-white shadow-lg  rounded-xl border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
              <th className="p-4 text-md">Profile</th>
              <th className="p-4 text-md">Name</th>
              <th className="p-4 text-md">Email</th>
              <th className="p-4 text-md">Last Searched on</th>
              <th className="p-4 text-md">View pipeline</th>
            </tr>
          </thead>
          <tbody className="">
            {candidates.map((candidate, index) => (
              <tr key={index} className="border-b last:border-none hover:bg-gray-50">
                <td className="p-4">
                  <img src={candidate.profile} alt="profile" className="w-10 h-10 rounded-full border-2 border-gray-300" />
                </td>
                <td className="p-4 text-sm font-medium text-gray-800">{candidate.name}</td>
                <td className="p-4 text-sm text-gray-600">{candidate.email}</td>
                <td className="p-4 text-sm text-gray-600">{candidate.lastSearched}</td>
                <td className="p-4">
                  <button className="text-sm text-white bg-purple-600 rounded-full px-5 py-2 font-medium hover:bg-purple-200  hover:text-black focus:ring-2 focus:ring-purple-500 transition duration-200">
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
