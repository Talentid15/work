import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateTracking from "./pages/index";
import BackgroundChecks from "./pages/backgroundChecks/BackgroundChecks";
import OfferIntelligence from "./pages/offerIntelligence/OfferIntelligence";
import People from "./components/backgroundChecks/People";
import Insufficiency from "./pages/backgroundChecks/Insufficiency";
import AddUser from "./components/backgroundChecks/AddUser";
import SearchHistory from "./pages/CTS/SearchHistory";
import MainContent from "./pages/CTS/MainContent";
import CandidateList from "./components/offerIntelligence/CandidateList";
import Profile from "./components/offerIntelligence/Profile";
import Predictions from "./components/offerIntelligence/Predictions";

function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<CandidateTracking />} >
          <Route index element={<MainContent/>} />
          <Route path="history" element={<SearchHistory />} />
          
          {/* <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
          <Route path="/signup" element={<PublicRoute><SignUp/></PublicRoute>} /> */}
          <Route path="backgroundchecks" element={<BackgroundChecks />} >
              <Route index element={<People/>} />
              <Route path='insufficiency' element={<Insufficiency/>} />
              <Route path='adduser' element={<AddUser/>} />
          </Route>
          <Route path="offerIntelligence" element={<OfferIntelligence />} > 
              <Route index element={<CandidateList/>}/>  
              <Route path='profile' element={<Profile/>} />
              <Route path='predictions' element={<Predictions/>} />
            </Route>
          </Route>      
        </Routes>

      </Router>

    </>
  );
}

export default App;
