import { useState, useEffect } from "react";
import { FaPencilAlt, FaTrash, FaUserPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../utils/api";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation popup
  const [memberToDelete, setMemberToDelete] = useState(null); // Store the member ID to delete
  const user = useSelector((state) => state.user.data);
  const  token  = useSelector((state) => state.user.data?.token);;

  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    role: "User",
  });
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL?? '';

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`${API_URL}/api/team`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setTeamMembers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch team members");
      console.error("Error fetching team members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!newMember.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!newMember.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!newMember.workEmail.trim()) {
      toast.error("Work email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(newMember.workEmail)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode) {
        await handleUpdateMember();
      } else {
        await handleAddMember();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleAddMember = async () => {
    try {
      const response = await api.post(
        `${API_URL}/api/team`,
        newMember,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setTeamMembers([...teamMembers, response.data]);
      toast.success("Team member added successfully");
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add team member");
      console.error("Error adding team member:", error);
    }
  };

  const handleEditMember = (member) => {
    setNewMember({
      firstName: member.firstName,
      lastName: member.lastName,
      workEmail: member.email,
      role: member.role,
    });
    setCurrentMemberId(member._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleUpdateMember = async () => {
    try {
      const response = await api.patch(
        `${API_URL}/api/team/${currentMemberId}`,
        {
          firstName: newMember.firstName,
          lastName: newMember.lastName,
          role: newMember.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setTeamMembers(
        teamMembers.map((member) =>
          member._id === currentMemberId ? response.data : member
        )
      );
      toast.success("Team member updated successfully");
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update team member");
      console.error("Error updating team member:", error);
    }
  };

  const handleDeleteMember = async (id) => {
    setIsDeleting(true);
    try {
      const response = await api.delete(`${API_URL}/api/team/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setTeamMembers(teamMembers.filter((member) => member._id !== id));
        toast.success("Team member deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error(error.response?.data?.message || "Failed to delete team member");
      await fetchTeamMembers(); // Refetch to sync with server
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false); // Close the popup
      setMemberToDelete(null); // Clear the member to delete
    }
  };

  const confirmDelete = (id) => {
    setMemberToDelete(id); // Set the member ID to delete
    setShowDeleteConfirm(true); // Show the confirmation popup
  };

  const resetForm = () => {
    setNewMember({ firstName: "", lastName: "", workEmail: "", role: "User" });
    setIsEditMode(false);
    setCurrentMemberId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
              <p className="text-gray-600">
                Manage your team members and their permissions
              </p>
            </div>
            {user.role === "Admin" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <FaUserPlus /> Add Team Member
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No team members found</p>
              {user.role === "Admin" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg"
                >
                  Add Your First Team Member
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    {user.role === "Admin" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                            {member.firstName.charAt(0)}
                            {member.lastName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.firstName} {member.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.role === "Admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      {user.role === "Admin" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditMember(member)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <FaPencilAlt />
                            </button>
                            <button
                              onClick={() => confirmDelete(member._id)} // Show confirmation popup
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                              title="Delete"
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
          )}
        </div>
      </div>

      {/* Add/Edit Team Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Team Member" : "Add New Team Member"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={newMember.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={newMember.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    name="workEmail"
                    value={newMember.workEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                    disabled={isEditMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="role"
                        value="User"
                        checked={newMember.role === "User"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span>User</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="role"
                        value="Admin"
                        checked={newMember.role === "Admin"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Admin</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  {isEditMode ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this team member? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setMemberToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMember(memberToDelete)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;