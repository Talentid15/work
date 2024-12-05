import React from "react";
import PeopleCard from "./PeopleCard";
const People = () => {
  const mockUsers = [
    {
      name: "Soham",
      email: "soham@example.com",
      phone: "+91-1234567890",
      staffId: "581515",
      joiningDate: "October 30, 2017",
    },
    {
      name: "Alma Lawson",
      email: "alma.lawson@example.com",
      phone: "+91-6575757575",
      staffId: "581515",
      joiningDate: "October 30, 2017",
    },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-1 rounded-md w-full">
          <PeopleCard />
        </div>
        </div>
    </>
  );
};

export default People