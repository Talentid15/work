import React, {useState} from "react";
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

    // Update users list (if necessary)
    // setUsers((prevUsers) => {
    //   const existingIndex = prevUsers.findIndex((u) => u.staffId === formData.staffId);
    //   if (existingIndex !== -1) {
    //     const updatedUsers = [...prevUsers];
    //     updatedUsers[existingIndex] = formData;
    //     return updatedUsers;
    //   }
    //   return [...prevUsers, formData];
    // });
    if (selectedUser) {
      // Update the user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...formData, id: user.id } : user
        )
      );
    } else {
      // Add new user
      setUsers((prevUsers) => [
        ...prevUsers,
        { ...formData, id: new Date().getTime() },
      ]);
    } 
    setSelectedUser(null); // Clear the form after editing
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-2 gap-x-8 flex-row">
      <InviteForm user={selectedUser} onSave={handleFormSubmit} />
      <SearchUser users={users} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
      <AdditionalDetails />
    </div>
  )
}

export default AddUser