import { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEdit, FaSave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import ChangePassword from "../../components/settings/ChangePassword";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Profiles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    user: {},
    additionalDetails: {}
  });

  const  token  = useSelector((state) => state.user.data?.token);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';

  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    company: "",
    website: "",
    state: "",
    bio: "",
    role: "",
    employees: ""
  });

  // Helper function to safely access nested properties
  const getSafeValue = (obj, path, defaultValue = "") => {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
  };

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        console.log(token)
        const response = await axios.get(
          `${API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );

        if (response.data?.success) {
          const { user = {}, additionalDetails = {} } = response.data;
          setProfileData({
            user,
            additionalDetails: user.additionalDetails || additionalDetails || {}
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
        email: getSafeValue(profileData.user, 'email'),
        mobileNumber: getSafeValue(profileData.user, 'phone'),
        company: getSafeValue(profileData.user, 'company'),
        website: getSafeValue(profileData.additionalDetails, 'companyWebsite'),
        state: getSafeValue(profileData.additionalDetails, 'state'),
        bio: getSafeValue(profileData.additionalDetails, 'bio'),
        role: getSafeValue(profileData.user, 'role'),
        employees: getSafeValue(profileData.additionalDetails, 'numberOfEmployees')
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/users/update-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );

      if (response.data?.success) {
        toast.success("Profile updated successfully!");
        setProfileData(prev => ({
          user: response.data.user || prev.user,
          additionalDetails: response.data.additionalDetails || prev.additionalDetails
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
      email: getSafeValue(profileData.user, 'email'),
      mobileNumber: getSafeValue(profileData.user, 'phone'),
      company: getSafeValue(profileData.user, 'company'),
      website: getSafeValue(profileData.additionalDetails, 'companyWebsite'),
      state: getSafeValue(profileData.additionalDetails, 'state'),
      bio: getSafeValue(profileData.additionalDetails, 'bio'),
      role: getSafeValue(profileData.user, 'role'),
      employees: getSafeValue(profileData.additionalDetails, 'numberOfEmployees')
    });
    setIsEditing(false);
  };

  if (isLoading && !profileData.user?.email) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!profileData.user?.email) {
    return <div className="text-center py-10">No profile data available</div>;
  }

  return (
    <div className="w-[90%] sm:block h-[550px] overflow-y-auto shadow-xl rounded-2xl no-scrollbar">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6">
          Personal Information
        </h2>

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center space-x-4">
            <img
              src={getSafeValue(profileData.user, 'userImage')}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-purple-400"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center border-b pb-1 sm:space-x-24">
                <h2 className="text-xl font-semibold">
                  {getSafeValue(profileData.user, 'fullname')}
                </h2>
                <FaRegEdit className="text-gray-500 cursor-pointer" />
              </div>
              <p className="text-sm text-gray-600 flex items-center justify-center sm:justify-start mt-2">
                <MdEmail className="mr-1" /> {getSafeValue(profileData.user, 'email')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-gray-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all mt-4 sm:mt-0"
          >
            Change Password
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                { label: "Email Address", name: "email", type: "email", readOnly: true },
                { label: "Company", name: "company", type: "text", readOnly: !isEditing },
                { label: "Website", name: "website", type: "text", readOnly: !isEditing },
                { label: "State/Province", name: "state", type: "text", readOnly: !isEditing },
                { label: "Bio", name: "bio", type: "text", as: "textarea", readOnly: !isEditing },
              ].map((input) => (
                <div className="relative w-full" key={input.name}>
                  <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                    {input.label}
                  </label>
                  {input.as === "textarea" ? (
                    <textarea
                      name={input.name}
                      value={formData[input.name]}
                      onChange={handleChange}
                      readOnly={input.readOnly}
                      className={`w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 h-24 ${input.readOnly ? "bg-gray-100" : ""
                        }`}
                    />
                  ) : (
                    <input
                      type={input.type}
                      name={input.name}
                      value={formData[input.name]}
                      onChange={handleChange}
                      readOnly={input.readOnly}
                      className={`w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 ${input.readOnly ? "bg-gray-100" : ""
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[
                { label: "Mobile Number", name: "mobileNumber", type: "tel", readOnly: !isEditing },
                { label: "Role", name: "role", type: "text", readOnly: true },
                { label: "No of Employees", name: "employees", type: "number", readOnly: !isEditing },
              ].map((input) => (
                <div className="relative w-full" key={input.name}>
                  <label className="absolute -top-3 left-3 bg-white px-1 text-gray-600 text-sm">
                    {input.label}
                  </label>
                  <input
                    type={input.type}
                    name={input.name}
                    value={formData[input.name]}
                    onChange={handleChange}
                    readOnly={input.readOnly}
                    className={`w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 ${input.readOnly ? "bg-gray-100" : ""
                      }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-center sm:justify-end gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 py-2 px-8 rounded-full shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isEditing
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-purple-900 text-white hover:bg-purple-300 hover:text-black"
                }`}
            >
              {isLoading ? (
                "Processing..."
              ) : isEditing ? (
                <>
                  <FaSave /> Save Changes
                </>
              ) : (
                "Edit Profile"
              )}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white text-purple-900 border border-purple-900 py-2 px-8 rounded-full shadow-md hover:bg-purple-300 hover:text-black transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {isModalOpen && (
        <ChangePassword onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Profiles;