
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/api";

const Notifications = () => {
  const  token  = useSelector((state) => state.user.data?.token);;
  const [preferences, setPreferences] = useState({
    masterToggle: true,
    specificNotifications: [
      { type: "team_member_added", emailEnabled: true, description: "Receive a notification when a new team member is added" },
      { type: "hiring_manager_added", emailEnabled: true, description: "Receive a notification when added as a hiring manager" },
    ]
  });
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL?? '';
  const [notifications, setNotifications] = useState([]);

  // Fetch preferences
  useEffect(() => {
    // const fetchPreferences = async () => {
    //   try {
    //     const response = await axios.get(
    //       "http://localhost:4000/api/notifications/preferences/me",
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //         withCredentials: true
    //       }
    //     );
    //     setPreferences(response.data);
    //   } catch (error) {
    //     console.error("Error fetching preferences:", error);
    //   }
    // };

    const fetchNotifications = async () => {
      try {
        const response = await api.get(
          `${API_URL}/api/notifications/all/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (token) {
      // fetchPreferences();
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
      specificNotifications: preferences.specificNotifications.map(item =>
        item.type === type ? { ...item, emailEnabled: !item.emailEnabled } : item
      )
    };
    setPreferences(newPrefs);
    await updatePreferences(newPrefs);
  };

  const updatePreferences = async (newPrefs) => {
    try {
      await api.put(
        `${API_URL}/api/notifications/preferences/me`,
        newPrefs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-start justify-start flex-col bg-white px-8 w-full">
      <h1 className="text-black text-2xl font-semibold mt-5">Notification Settings</h1>
      
      <div className="w-full max-w-[66rem] mt-2">
        {/* Master Toggle */}
        <div className="flex items-center mb-4">
          <button
            onClick={toggleMaster}
            className={`relative w-12 h-6 rounded-full transition duration-300 ${
              preferences.masterToggle ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition duration-300 ${
                preferences.masterToggle ? "translate-x-6" : "translate-x-0"
              }`}
            ></span>
          </button>
          <span className="ml-2 font-medium">
            Master Notification Toggle {preferences.masterToggle ? "On" : "Off"}
          </span>
        </div>

        {/* Preferences Table */}
        <div className="bg-white shadow-2xl rounded-2xl p-4 mb-8">
          <h2 className="text-lg font-semibold mb-4">Email Preferences</h2>
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-white text-black border-b">
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Description</th>
                <th className="text-center p-3">Emails</th>
              </tr>
            </thead>
            <tbody>
              {preferences.specificNotifications.map((item) => (
                <tr key={item.type}>
                  <td className="p-3">{item.type.replace("_", " ")}</td>
                  <td className="p-3 text-gray-600">{item.description}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleNotification(item.type)}
                      disabled={!preferences.masterToggle}
  
                      className={`relative w-12 h-6 rounded-full transition duration-300 ${
                        preferences.masterToggle && item.emailEnabled ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition duration-300 ${
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

        {/* Notifications List */}
        <div className="bg-white shadow-2xl rounded-2xl p-4 h-96 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-600">No notifications yet</p>
          ) : (
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-white text-black border-b">
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Description</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification._id}>
                    <td className="p-3">{notification.title}</td>
                    <td className="p-3 text-gray-600">{notification.description}</td>
                    <td className="p-3">{new Date(notification.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;