import axios from "axios";
import {useVerificationStore} from "../redux/userStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_BACKEND_URL ?? "http://localhost:4000",
  withCredentials: true,
});

// Function to set up interceptors
export const setupAxiosInterceptors = () => {
  api.interceptors.response.use(
    (response) => {
      console.log("API Response:", response); // Debug
      return response;
    },
    (error) => {
      console.log("API Error:", error.response); // Debug
      if (error.response?.status === 403) {
        const { actionRequired } = error.response.data;
        console.log("Action Required:", actionRequired); // Debug
        const { setOtpPopup, setDocumentPopup } = useVerificationStore.getState();

        if (actionRequired === "verifyEmail") {
          setOtpPopup(true, error.config);
        } else if (actionRequired === "uploadDocuments") {
          setDocumentPopup(true, error.config);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;