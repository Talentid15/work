import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateTracking from "./pages/CTS/index";
import BackgroundChecks from "./pages/backgroundChecks/index";
import OfferIntelligence from "./pages/offerIntelligence/index";
import People from "./components/backgroundChecks/People";
import Insufficiency from "./components/backgroundChecks/Insufficiency";
import AddUser from "./components/backgroundChecks/AddUser";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CandidateTracking />} />
          
          {/* <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
          <Route path="/signup" element={<PublicRoute><SignUp/></PublicRoute>} /> */}
          <Route path="/backgroundchecks" element={<BackgroundChecks />} >
              <Route index element={<People/>} />
              <Route path='insufficiency' element={<Insufficiency/>} />
              <Route path='adduser' element={<AddUser/>} />
          </Route>
          <Route path="/offerIntelligence" element={<OfferIntelligence />} />         
        </Routes>
      </Router>

    </>
  );
}

export default App;
