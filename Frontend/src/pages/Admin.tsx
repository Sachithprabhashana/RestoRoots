import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';

export const Admin: React.FC = () => {
    return (
        <div className="max-w-[1280px] mx-auto px-6 pt-32 pb-16">
            <div className="flex flex-col gap-6 md:flex-row">
                <AdminSidebar />
                <div className="flex-1 p-6 bg-white border border-gray-200 rounded-2xl sm:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Admin;