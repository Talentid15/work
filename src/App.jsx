import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CandidateTracking from "./pages/index";
import BackgroundChecks from "./pages/backgroundChecks/BackgroundChecks";
import OfferIntelligence from "./pages/offerIntelligence/OfferIntelligence";
import People from "./components/backgroundChecks/People";
import Insufficiency from "./pages/backgroundChecks/Insufficiency";
import AddUser from "./pages/backgroundChecks/AddUser";
import SearchHistory from "./pages/CTS/SearchHistory";
import MainContent from "./pages/CTS/MainContent";
import CandidateList from "./components/offerIntelligence/List";
import Profile from "./pages/offerIntelligence/Profile";
import Predictions from "./components/offerIntelligence/Predictions";
import Pipeline from "./pages/CTS/Pipeline";
import AddCandidate from "./components/offerIntelligence/AddCandidate";
import ExtractDataFromPdf from "./pages/ExtractDataFromPdf";

import ForgotPassword from "./pages/ForgotPasswordPage";
import OfferPunch from "./pages/CTS/OfferPunch";
import Settings from "./pages/settings/Settings";
import Profiles from "./pages/settings/Profiles";
import Users from "./pages/settings/Users";
import Integerations from "./pages/settings/Integerations";
import Subscriptions from "./pages/settings/Subscriptions";
import Notifications from "./pages/settings/Notifications";

import DashBoard from "./pages/DashBoard/DashBoard";
import Onboarding from "./pages/onboarding/Onboarding";
import Offered from "./pages/onboarding/Offered";
import OnboardPlan from "./pages/onboarding/OnboardPlan";
import OnboardMaretial from "./pages/onboarding/OnboardMaretial";

import PublicRoute from "./pages/PublicRoutes";
import ProtectedRoute from "./pages/ProtectedRoute";

// import VerificationPage from "./pages/VerificationPage";

import Release_Offer from "./pages/ReleaseOffer/Release_Offer";
import Job_Offer from "./pages/JobOffer/Job_Offer";
import CareerPage from "./pages/CarrerPage/CarrerPage";

import OfferDetail from "./pages/JobOffer/Job_OfferDetails";
import InvitePage from './pages/CTS/InvitePage';
import toast from 'react-hot-toast';
import api, { setupAxiosInterceptors } from './utils/api';
import { useVerificationStore } from './redux/userStore';
import { useEffect } from 'react';
import DocumentUploadPopup from './pages/documentVerify';
import OtpVerificationPopup from './pages/OtpVerify';


function App() {
  const { showOtpPopup, showDocumentPopup, failedRequest, setOtpPopup, setDocumentPopup } =
    useVerificationStore();
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "http://localhost:4000";

  useEffect(() => {
    console.log("Setting up Axios interceptors");
    setupAxiosInterceptors();
  }, []);

  // OTP popup handlers
  const handleOtpVerify = async () => {
    console.log("OTP Verified, retrying request:", failedRequest);
    setOtpPopup(false);
    if (failedRequest) {
      try {
        const response = await api.request(failedRequest);
        console.log("Retry success:", response.data);
        toast.success("Action completed successfully");
        return response;
      } catch (error) {
        console.error("Retry failed:", error);
        toast.error(error.response?.data?.message || "Failed to retry action");
      }
    }
  };

  const handleOtpResend = () => {
    console.log("Resending OTP");
    toast.success("OTP resent successfully. Check your email.");
  };

  const handleOtpSkip = () => {
    console.log("Skipping OTP");
    setOtpPopup(false);
  };

  const handleOtpClose = () => {
    console.log("Closing OTP popup");
    setOtpPopup(false);
  };

  // Document popup handlers
  const handleDocumentSubmit = async () => {
    console.log("Document submitted, retrying request:", failedRequest);
    setDocumentPopup(false);
    if (failedRequest) {
      try {
        const response = await api.request(failedRequest);
        console.log("Retry success:", response.data);
        toast.success("Action completed successfully");
        return response;
      } catch (error) {
        console.error("Retry failed:", error);
        toast.error(error.response?.data?.message || "Failed to retry action");
      }
    }
  };

  const handleDocumentSkip = () => {
    console.log("Skipping document upload");
    setDocumentPopup(false);
  };

  const handleDocumentClose = () => {
    console.log("Closing document popup");
    setDocumentPopup(false);
  };
  return (
    <>


      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={

            <PublicRoute>

              <Signup />

            </PublicRoute>

          }

          />

          {/* <Route path="/verification-page" element={<PublicRoute><VerificationPage></VerificationPage></PublicRoute>}></Route> */}

          <Route path="/auth/forgot-password/:id" element={

            <PublicRoute>

              <ForgotPassword></ForgotPassword>

            </PublicRoute>

          }></Route>

          <Route path="/" element={

            <ProtectedRoute>

              <CandidateTracking />

            </ProtectedRoute>

          } >

            <Route index element={<MainContent />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="history" element={<SearchHistory />} />
            <Route path="pipeline/:userId" element={<Pipeline />} />
            <Route path="offer-punch" element={<OfferPunch />} />

            <Route index path="/dashboard" element={<DashBoard />} />
            <Route index path="/carrerpage" element={<CareerPage />} />
            <Route index path="/joboffers" element={<Job_Offer />} />
            <Route index path="/release-offer" element={<Release_Offer />} />
            <Route path="/extractInfo" element={<ExtractDataFromPdf />} />
            <Route path="/joboffers/:id" element={<OfferDetail></OfferDetail>}></Route>

            {/* <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
          <Route path="/signup" element={<PublicRoute><SignUp/></PublicRoute>} /> */}
            <Route path="backgroundchecks" element={<BackgroundChecks />} >
              <Route index element={<People />} />
              <Route path='insufficiency' element={<Insufficiency />} />
              <Route path='adduser' element={<AddUser />} />
            </Route>

            <Route path="onboarding" element={<Onboarding />} >
              <Route index element={<Offered />} />
              <Route path='onboardplan' element={<OnboardPlan />} />
              <Route path='onboardingmaterial' element={<OnboardMaretial />} />
            </Route>

            <Route path="settings" element={<Settings />} >
              <Route index element={<Profiles />} />
              <Route path='integration' element={<Integerations />} />
              <Route path='user' element={<Users />} />
              <Route path='subscription' element={<Subscriptions />} />
              <Route path='notification' element={<Notifications />} />
            </Route>

            <Route path="offerIntelligence" element={<OfferIntelligence />} >
              <Route index element={<CandidateList />} />
              <Route path='profile' element={<Profile />} />
              <Route path='prediction' element={<Predictions />} />
              <Route path='addCandidate' element={<AddCandidate />} />
            </Route>

          </Route>

        </Routes>

      </Router>
      {showOtpPopup && (
        <OtpVerificationPopup
          apiUrl={API_URL}
          onClose={handleOtpClose}
          onSkip={handleOtpSkip}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
        />
      )}
      {showDocumentPopup && (
        <DocumentUploadPopup
          apiUrl={API_URL}
          onClose={handleDocumentClose}
          onSkip={handleDocumentSkip}
          onSubmit={handleDocumentSubmit}
        />
      )}
    </>
  );
}

export default App;