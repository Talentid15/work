import  { useState } from "react";
import InviteForm from "../../components/backgroundChecks/InviteForm";
import SearchUser from "../../components/backgroundChecks/SearchUser";
import AdditionalDetails from "../../components/backgroundChecks/AdditionalDetails";

const AddUser = () => {
  const [users, setUsers] = useState([
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
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-1234567890",
      staffId: "123456",
      joiningDate: "February 5, 2020",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleFormSubmit = (formData) => {
    console.log("Saved data:", formData);

    if (selectedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...formData, id: user.id } : user
        )
      );
    } else {
      setUsers((prevUsers) => [
        ...prevUsers,
        { ...formData, id: new Date().getTime() },
      ]);
    }
    setSelectedUser(null);
  };

  return (
    <div className="w-full max-h-[80vh] overflow-auto p-4  rounded-lg shadow-lg no-scrollbar">
      {/* Responsive Flexbox for Form and User List */}
      <div className="flex flex-col md:flex-row gap-6">
        <InviteForm user={selectedUser} onSave={handleFormSubmit} />
        <SearchUser users={users} onDelete={handleDelete} onEdit={handleEdit} />
      </div>

      {/* Additional Details Section */}
      <AdditionalDetails />
    </div>
  );
};

export default AddUser;
