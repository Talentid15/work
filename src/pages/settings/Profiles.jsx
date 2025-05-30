import { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEdit, FaSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import ChangePassword from "../../components/settings/ChangePassword";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import api from "../../utils/api";

const Profiles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    user: {},
    additionalDetails: {},
  });

  const token = useSelector((state) => state.user.data?.token);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    company: "",
    website: "",
    state: "",
    bio: "",
    role: "",
    employees: "",
  });

  const getSafeValue = (obj, path, defaultValue = "") => {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data?.success) {
          const { user = {}, additionalDetails = {} } = response.data;
          setProfileData({
            user,
            additionalDetails: user.additionalDetails || additionalDetails || {},
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  useEffect(() => {
    if (profileData.user) {
      setFormData({
        email: getSafeValue(profileData.user, "email"),
        mobileNumber: getSafeValue(profileData.user, "phone"),
        company: getSafeValue(profileData.user, "company"),
        website: getSafeValue(profileData.additionalDetails, "companyWebsite"),
        state: getSafeValue(profileData.additionalDetails, "state"),
        bio: getSafeValue(profileData.additionalDetails, "bio"),
        role: getSafeValue(profileData.user, "role"),
        employees: getSafeValue(profileData.additionalDetails, "numberOfEmployees"),
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        `${API_URL}/api/users/update-user`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data?.success) {
        toast.success("Profile updated successfully!", {
          style: {
            backgroundColor: '#652d96',
            color: '#ffffff',
          },
        });
        setProfileData((prev) => ({
          user: response.data.user || prev.user,
          additionalDetails: response.data.additionalDetails || prev.additionalDetails,
        }));
        setIsEditing(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: getSafeValue(profileData.user, "email"),
      mobileNumber: getSafeValue(profileData.user, "phone"),
      company: getSafeValue(profileData.user, "company"),
      website: getSafeValue(profileData.additionalDetails, "companyWebsite"),
      state: getSafeValue(profileData.additionalDetails, "state"),
      bio: getSafeValue(profileData.additionalDetails, "bio"),
      role: getSafeValue(profileData.user, "role"),
      employees: getSafeValue(profileData.additionalDetails, "numberOfEmployees"),
    });
    setIsEditing(false);
  };

  if (isLoading && !profileData.user?.email) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  if (!profileData.user?.email) {
    return <div className="text-center py-10 text-gray-500">No profile data available</div>;
  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={getSafeValue(profileData.user, "userImage") || "https://via.placeholder.com/48"}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-purple-400"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {getSafeValue(profileData.user, "fullname")}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                <MdEmail className="mr-1" /> {getSafeValue(profileData.user, "email")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-md"
            aria-label="Change password"
          >
            Change Password
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Email Address", name: "email", type: "email", readOnly: true },
              { label: "Company", name: "company", type: "text", readOnly: !isEditing },
              { label: "Website", name: "website", type: "text", readOnly: !isEditing },
              { label: "State/Province", name: "state", type: "text", readOnly: !isEditing },
              { label: "Bio", name: "bio", type: "text", as: "textarea", readOnly: !isEditing },
            ].map((input) => (
              <div key={input.name} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                {input.as === "textarea" ? (
                  <textarea
                    name={input.name}
                    value={formData[input.name]}
                    onChange={handleChange}
                    readOnly={input.readOnly}
                    className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${input.readOnly ? "bg-gray-100" : ""
                      }`}
                  />
                ) : (
                  <input
                    type={input.type}
                    name={input.name}
                    value={formData[input.name]}
                    onChange={handleChange}
                    readOnly={input.readOnly}
                    className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${input.readOnly ? "bg-gray-100" : ""
                      }`}
                  />
                )}
              </div>
            ))}
            {[
              { label: "Mobile Number", name: "mobileNumber", type: "tel", readOnly: !isEditing },
              { label: "Role", name: "role", type: "text", readOnly: true },
              { label: "No of Employees", name: "employees", type: "number", readOnly: !isEditing },
            ].map((input) => (
              <div key={input.name} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                <input
                  type={input.type}
                  name={input.name}
                  value={formData[input.name]}
                  onChange={handleChange}
                  readOnly={input.readOnly}
                  className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${input.readOnly ? "bg-gray-100" : ""
                    }`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all duration-300 shadow-md ${isEditing
                  ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105"
                  : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"
                } disabled:opacity-50`}
            >
              {isLoading ? (
                "Processing..."
              ) : isEditing ? (
                <>
                  <FaSave /> Save Changes
                </>
              ) : (
                <>
                  <FaRegEdit /> Edit Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {isModalOpen && <ChangePassword onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Profiles;