import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateTracking from "./pages/CTS/index";
import BackgroundChecks from "./pages/backgroundChecks/index";
import OfferIntelligence from "./pages/offerIntelligence/index";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CandidateTracking />} />
          {/* <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
          <Route path="/signup" element={<PublicRoute><SignUp/></PublicRoute>} /> */}
          <Route path="/backgroundChecks" element={<BackgroundChecks />} />
          <Route path="/offerIntelligence" element={<OfferIntelligence />} />         
        </Routes>
      </Router>

    </>
  );
}

export default App;
