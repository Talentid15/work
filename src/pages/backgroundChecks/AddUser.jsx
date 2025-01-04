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

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, { id: Date.now(), ...user }]);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-2 gap-x-8 flex-row">
        <InviteForm onSubmit={addUser}/>
        <SearchUser users={users}/>
      </div>
      <AdditionalDetails />
    </div>
  )
}

export default AddUser