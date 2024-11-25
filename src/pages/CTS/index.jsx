import React from 'react';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MainContent from "../../components/CTS/MainContent";
// import SearchHistory from '../../components/CTS/SearchHistory';

function index() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <MainContent />
          </div>
        </div>
    )
}

export default index