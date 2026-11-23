import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlusCircle, ClipboardList, ShoppingBag } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive
            ? 'bg-[#fff4f2] text-[#FF4C24] border border-[#FF4C24]/40'
            : 'text-gray-600 hover:bg-gray-100'
        }`;

    return (
        <aside className="w-full p-4 bg-white border border-gray-200 md:w-64 rounded-2xl h-fit shrink-0">
            <p className="px-3 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Admin Panel
            </p>
            <nav className="flex flex-col gap-2">
                <NavLink to="/admin/add" className={linkClass}>
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Items</span>
                </NavLink>
                <NavLink to="/admin/list" className={linkClass}>
                    <ClipboardList className="w-4 h-4" />
                    <span>List Items</span>
                </NavLink>
                <NavLink to="/admin/orders" className={linkClass}>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Orders</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default AdminSidebar;