import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/api";

const Notifications = () => {
  const token = useSelector((state) => state.user.data?.token);
  const [preferences, setPreferences] = useState({
    masterToggle: true,
    specificNotifications: [
      {
        type: "team_member_added",
        emailEnabled: true,
        description: "Receive a notification when a new team member is added",
      },
      {
        type: "hiring_manager_added",
        emailEnabled: true,
        description: "Receive a notification when added as a hiring manager",
      },
    ],
  });
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get(`${API_URL}/api/notifications/all/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const toggleMaster = async () => {
    const newPrefs = { ...preferences, masterToggle: !preferences.masterToggle };
    setPreferences(newPrefs);
    await updatePreferences(newPrefs);
  };

  const toggleNotification = async (type) => {
    const newPrefs = {
      ...preferences,
      specificNotifications: preferences.specificNotifications.map((item) =>
        item.type === type ? { ...item, emailEnabled: !item.emailEnabled } : item
      ),
    };
    setPreferences(newPrefs);
    await updatePreferences(newPrefs);
  };

  const updatePreferences = async (newPrefs) => {
    try {
      await api.put(`${API_URL}/api/notifications/preferences/me`, newPrefs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>

        {/* Master Toggle */}
        <div className="flex items-center mb-6">
          <button
            onClick={toggleMaster}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
              preferences.masterToggle ? "bg-purple-600" : "bg-gray-300"
            }`}
            aria-label="Master notification toggle"
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                preferences.masterToggle ? "translate-x-6" : "translate-x-0"
              }`}
            ></span>
          </button>
          <span className="ml-3 text-gray-700 font-medium">
            Master Notification Toggle {preferences.masterToggle ? "On" : "Off"}
          </span>
        </div>

        {/* Preferences Table */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Preferences</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emails
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {preferences.specificNotifications.map((item) => (
                  <tr key={item.type} className="hover:bg-purple-50 transition-all duration-200">
                    <td className="px-4 py-3 text-gray-800">{item.type.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-gray-600">{item.description}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleNotification(item.type)}
                        disabled={!preferences.masterToggle}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                          preferences.masterToggle && item.emailEnabled ? "bg-purple-600" : "bg-gray-300"
                        }`}
                        aria-label={`Toggle ${item.type} notification`}
                      >
                        <span
                          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                            preferences.masterToggle && item.emailEnabled ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-600">No notifications yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <tr key={notification._id} className="hover:bg-purple-50 transition-all duration-200">
                      <td className="px-4 py-3 text-gray-800">{notification.title}</td>
                      <td className="px-4 py-3 text-gray-600">{notification.description}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;