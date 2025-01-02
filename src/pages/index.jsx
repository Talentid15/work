import React from 'react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from 'react-router-dom';

function Index() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <div className="fixed top-0 z-50 w-full">
                <Header />
            </div>

            <div className="flex flex-1 pt-14">
                {/* Sidebar */}
                <div className="fixed top-14 z-10 h-full w-64">
                    <Sidebar />
                </div>

                {/* Main Content (Outlet) */}
                <div className="flex-1 overflow-auto ml-64 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Index;
