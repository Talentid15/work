import React from "react";
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
import ProfileUpdate from "./pages/offerIntelligence/ProfileUpdate";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<CandidateTracking />} >
            <Route index element={<MainContent />} />
            <Route path="history" element={<SearchHistory />} />
            <Route path="pipeline" element={<Pipeline />} />


            {/* <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
          <Route path="/signup" element={<PublicRoute><SignUp/></PublicRoute>} /> */}
            <Route path="backgroundchecks" element={<BackgroundChecks />} >
              <Route index element={<People />} />
              <Route path='insufficiency' element={<Insufficiency />} />
              <Route path='adduser' element={<AddUser />} />
            </Route>
            <Route path="offerIntelligence" element={<OfferIntelligence />} >
              <Route index element={<CandidateList />} />
              <Route path='profile' element={<Profile />} />
              <Route path='prediction' element={<Predictions />} />
              <Route path='profileUpdate' element={<ProfileUpdate />} />
            </Route>
          </Route>
        </Routes>

      </Router>

    </>
  );
}

export default App;
