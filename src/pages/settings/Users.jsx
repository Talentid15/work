import { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.user.data);

  const [teamMembers, setTeamMembers] = useState([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      workEmail: "john@example.com",
      role: "Admin"
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      workEmail: "jane@example.com",
      role: "User"
    }
  ]);

  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    role: "User"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.workEmail) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("/api/team/members", {
        ...newMember,
        createdBy: "current-user-id"
      });

      setTeamMembers([...teamMembers, response.data]);
      setIsModalOpen(false);
      setNewMember({
        firstName: "",
        lastName: "",
        workEmail: "",
        role: "User"
      });
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`/api/team/members/${id}`);
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Management</h2>

        {user.role === "Admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg"
          >
            Add Team Member +
          </button>
        )}
      </div>

      {/* Team Members Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">First Name</th>
              <th className="p-3 text-left">Last Name</th>
              <th className="p-3 text-left">Work Email</th>
              <th className="p-3 text-left">Role</th>
              {user.role === "Admin" && <th className="p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{member.firstName}</td>
                <td className="p-3">{member.lastName}</td>
                <td className="p-3">{member.workEmail}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    member.role === "Admin" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {member.role}
                  </span>
                </td>
                {user.role === "Admin" && (
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaPencilAlt />
                      </button>
                      <button 
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && user.role === "Admin" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Team Member</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={newMember.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={newMember.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  name="workEmail"
                  value={newMember.workEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
