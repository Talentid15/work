// src/context/VerificationContext.jsx
import { createContext, useState, useContext } from "react";
import OtpVerificationPopup from "./OtpVerify";
import DocumentUploadPopup from "./documentVerify";

const VerificationContext = createContext();

// eslint-disable-next-line react/prop-types
export const VerificationProvider = ({ children }) => {
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [userData, setUserData] = useState({
    userId: null,
    email: null,
  });
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "http://localhost:4000";

  const showVerificationPopup = ({ actionRequired, userId, email }) => {
    if (actionRequired === "verifyEmail") {
      setUserData({ userId, email });
      setShowOtpPopup(true);
    } else if (actionRequired === "uploadDocuments") {
      setShowDocumentPopup(true);
    }
  };

  const handleOtpVerify = () => {
    setShowOtpPopup(false);
    alert("Email verified successfully!");
    // Optionally trigger a retry of the failed API call
  };

  const handleOtpResend = () => {
    alert("OTP resent successfully!");
  };

  const handleOtpSkip = () => {
    setShowOtpPopup(false);
  };

  const handleOtpClose = () => {
    setShowOtpPopup(false);
  };

  const handleDocumentSubmit = () => {
    setShowDocumentPopup(false);
    alert("Document uploaded successfully!");
    // Optionally trigger a retry of the failed API call
  };

  const handleDocumentSkip = () => {
    setShowDocumentPopup(false);
  };

  const handleDocumentClose = () => {
    setShowDocumentPopup(false);
  };

  return (
    <VerificationContext.Provider value={{ showVerificationPopup }}>
      {children}
      {showOtpPopup && (
        <OtpVerificationPopup
          email={userData.email}
          apiUrl={API_URL} 
          onClose={handleOtpClose}
          onSkip={handleOtpSkip}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
        />
      )}
      {showDocumentPopup && (
        <DocumentUploadPopup
          userId={userData.userId}
          apiUrl={API_URL} 
          onClose={handleDocumentClose}
          onSkip={handleDocumentSkip}
          onSubmit={handleDocumentSubmit}
        />
      )}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => useContext(VerificationContext);