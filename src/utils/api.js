import axios from "axios";
import { useVerificationStore } from "../redux/userStore";
import { useSelector } from "react-redux";

const api = axios.create({
  withCredentials: true,
});

let interceptorId = null;

export const setupAxiosInterceptors = () => {
  if (interceptorId !== null) {
    api.interceptors.response.eject(interceptorId);
  }

  interceptorId = api.interceptors.response.use(
    (response) => {
      // console.log("api.js: API Response:", {
      //   method: response.config.method,
      //   url: response.config.url,
      //   status: response.status,
      //   data: response.data,
      // });
      return response;
    },
    (error) => {
      // console.log("api.js: API Error:", {
      //   method: error.config?.method,
      //   url: error.config?.url,
      //   status: error.response?.status,
      //   data: error.response?.data,
      // });

      const user = useSelector((state) => state.user.data || {});
      if (error.response?.status === 403 && !user?.verifiedDocuments) {
        const { actionRequired } = error.response.data;
        console.log("api.js: Action Required:", actionRequired);
        const { setOtpPopup, setDocumentPopup } = useVerificationStore.getState();

        if (actionRequired === "verifyEmail") {
          console.log("api.js: Setting OTP popup");
          setOtpPopup(true, error.config, true);
        } else if (actionRequired === "uploadDocuments" || actionRequired === "verifyDocuments") {
          console.log("api.js: Setting Document popup for action:", actionRequired);
          setDocumentPopup(true, error.config, true);
        } else {
          console.log("api.js: Unknown actionRequired:", actionRequired);
        }
      } else {
        console.log("api.js: Non-403 error or documents verified:", error.message);
      }

      return Promise.reject(error);
    }
  );
};

export default api;