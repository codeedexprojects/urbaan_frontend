import React from 'react';
import { Outlet } from "react-router-dom";
import { AppSidebar } from '../Components/Sidebar/Sidebar';
import { AppNavbar } from '../Components/Navbar/Navbar';

const Home = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="">
                <AppSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <div>
                    <AppNavbar />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-tertiary p-4 lg:p-8 border-l-[1px] border-t-[1px] border-gray-300">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Home;
