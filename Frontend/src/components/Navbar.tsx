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

    if (!context) {
        return null;
    }

    const {
        token,
        setToken,
        isAdmin,
        setIsAdmin,
        getTotalCartAmount,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
    } = context;

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setToken('');
        setIsAdmin(false);
        navigate('/');
    };

    const handleSearchToggle = () => {
        setIsSearchOpen((prev) => {
            const next = !prev;
            if (!next) {
                setSearchQuery('');
            }
            return next;
        });
    };

    return (
        <nav className="w-full max-w-[1280px] mx-auto px-6 py-6 flex flex-wrap items-center justify-between fixed top-3 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-md rounded-2xl">
            {/* Brand Logo */}
            <Link to="/" className="text-3xl md:text-4xl font-bold text-[#FF4C24] tracking-tight">
                RestoRoots.
            </Link>

            {/* Navigation Links */}
            <ul className="hidden md:flex items-center gap-8 text-[#49557e] text-[17px] font-normal">
                {[
                    { id: 'home', label: 'home', href: '/' },
                    { id: 'menu', label: 'menu', href: '/#explore-menu' },
                    { id: 'mobile-app', label: 'mobile app', href: '/#app-download' },
                    { id: 'contact-us', label: 'contact us', href: '/#footer' },
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
                <button
                    type="button"
                    onClick={handleSearchToggle}
                    aria-label="Toggle search"
                    className="cursor-pointer"
                >
                    <Search className="w-6 h-6 text-[#49557e] hover:text-[#FF4C24] transition" />
                </button>

                <Link to="/cart" className="relative cursor-pointer">
                    <ShoppingBag className="w-6 h-6 text-[#49557e] hover:text-[#FF4C24] transition" />
                    {getTotalCartAmount() > 0 && (
                        <span className="w-2 h-2 bg-[#FF4C24] rounded-full absolute -top-1 -right-1" />
                    )}
                </Link>

                {!token ? (
                    <button
                        type="button"
                        onClick={() => setShowLogin(true)}
                        className="border border-[#FF4C24] text-[#49557e] px-7 py-2.5 rounded-full hover:bg-[#fff4f2] transition cursor-pointer"
                    >
                        sign in
                    </button>
                ) : (
                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => navigate('/admin/orders')}
                                className="text-sm font-semibold text-[#FF4C24] hover:underline transition cursor-pointer"
                            >
                                Admin Panel
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate('/myorders')}
                            className="text-sm font-medium text-[#49557e] hover:text-[#FF4C24] transition cursor-pointer"
                        >
                            My Orders
                        </button>
                        <button
                            type="button"
                            onClick={logout}
                            className="border border-[#FF4C24] text-[#FF4C24] px-5 py-2 rounded-full text-sm hover:bg-[#fff4f2] transition cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Search Input Bar */}
            {isSearchOpen && (
                <div className="flex items-center w-full max-w-xl gap-2 px-4 py-2 mx-auto mt-3 bg-white border border-gray-200 rounded-full shadow-sm basis-full">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search dishes by name, category, or ingredient..."
                        className="w-full text-sm text-gray-700 outline-none"
                        autoFocus
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="text-xs font-medium text-gray-400 cursor-pointer hover:text-gray-600"
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};