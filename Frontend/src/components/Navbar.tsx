import React, { useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const [menu, setMenu] = useState<string>('home');

    return (
        <nav className="w-full max-w-[1280px] mx-auto px-6 py-6 flex items-center justify-between fixed top-3 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-md rounded-2xl">
            {/* Brand Logo */}
            <Link to="/" className="text-3xl md:text-4xl font-bold text-[#FF4C24] tracking-tight">
                RestoRoots.
            </Link>

            {/* Navigation Links */}
            <ul className="hidden md:flex items-center gap-8 text-[#49557e] text-[17px] font-normal">
                {[
                    { id: 'home', label: 'home', href: '/' },
                    { id: 'menu', label: 'menu', href: '/#explore-menu' },
                    { id: 'mobile-app', label: 'mobile app', href: '#app-download' },
                    { id: 'contact-us', label: 'contact us', href: '#footer' },
                ].map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.href}
                            onClick={() => setMenu(item.id)}
                            className={`pb-1 transition-all cursor-pointer ${menu === item.id
                                ? 'border-b-2 border-[#49557e] text-[#262626] font-medium'
                                : 'hover:text-[#FF4C24]'
                                }`}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Right Actions */}
            <div className="flex items-center gap-6 md:gap-8">
                <Search className="w-6 h-6 text-[#49557e] cursor-pointer hover:text-[#FF4C24] transition" />

                <Link to="/cart" className="relative cursor-pointer">
                    <ShoppingBag className="w-6 h-6 text-[#49557e] hover:text-[#FF4C24] transition" />
                    <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-[#FF4C24] rounded-full"></span>
                </Link>

                <button className="px-7 py-2.5 rounded-full border border-[#FF4C24] text-[#49557e] text-[16px] font-medium hover:bg-[#fff4f2] transition cursor-pointer">
                    sign in
                </button>
            </div>
        </nav>
    );
};