import React, { useContext, useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

interface NavbarProps {
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({ setShowLogin }) => {
    const [menu, setMenu] = useState<string>('home');
    const context = useContext(StoreContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        context?.setToken('');
        navigate('/');
    };

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
                    {context && context.getTotalCartAmount() > 0 && (
                        <span className="w-2 h-2 bg-[#FF4C24] rounded-full absolute -top-1 -right-1" />
                    )}
                </Link>

                {!context?.token ? (
                    <button
                        onClick={() => setShowLogin(true)}
                        className="border border-[#FF4C24] text-[#49557e] px-7 py-2.5 rounded-full hover:bg-[#fff4f2] transition cursor-pointer"
                    >
                        sign in
                    </button>
                ) : (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/myorders')}
                            className="text-sm font-medium text-[#49557e] hover:text-[#FF4C24] transition cursor-pointer"
                        >
                            My Orders
                        </button>
                        <button
                            onClick={logout}
                            className="border border-[#FF4C24] text-[#FF4C24] px-5 py-2 rounded-full text-sm hover:bg-[#fff4f2] transition cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};