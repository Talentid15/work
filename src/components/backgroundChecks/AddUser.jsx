import React from "react";
import InviteForm from "./InviteForm";
import SearchUser from "./SearchUser";
// import UserDetailsCard from "./UserDetailsCard";

// const App = () => {
//   const mockUsers = [
//     {
//       name: "Soham",
//       email: "soham@example.com",
//       phone: "+91-1234567890",
//       staffId: "581515",
//       joiningDate: "October 30, 2017",
//     },
//     {
//       name: "Alma Lawson",
//       email: "alma.lawson@example.com",
//       phone: "+91-6575757575",
//       staffId: "581515",
//       joiningDate: "October 30, 2017",
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-6">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* Invite Form */}
//         <div className="bg-white p-6 shadow-md rounded-md">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">Invite Form</h1>
//           <InviteForm />
//         </div>

//         {/* Search History Table */}
//         <div className="bg-white p-6 shadow-md rounded-md">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">Search History Table</h1>
//           <SearchUser users={mockUsers} />
//         </div>

//         {/* User Details */}
//         <div className="bg-white p-6 shadow-md rounded-md">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">User Details</h1>
//           {mockUsers.map((user, index) => (
//             <UserDetailsCard
//               key={index}
//               name={user.name}
//               email={user.email}
//               phone={user.phone}
//               staffId={user.staffId}
//               joiningDate={user.joiningDate}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;



const AddUser = () => {
  return (
    <div className="flex gap-4 mt-4 flex-row">
    <InviteForm />
    <SearchUser />
    </div>
  )
}

export default AddUser