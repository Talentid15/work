import React from "react";
import InviteForm from "../../components/backgroundChecks/InviteForm";
import SearchUser from "../../components/backgroundChecks/SearchUser";

const AddUser = () => {
  return (
    <div className="flex flex-2 gap-x-4 flex-row">
    <InviteForm />
    <SearchUser />
    </div>
  )
}

export default AddUser