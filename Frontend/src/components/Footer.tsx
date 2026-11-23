import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer
            id="footer"
            className="w-full bg-[#323232] text-[#d9d9d9] mt-20 pt-14 pb-8 px-6"
        >
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-gray-600">
                {/* Brand & Summary */}
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-[#FF4C24] tracking-tight">
                        RestoRoots.
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-300">
                        Freshly prepared dishes crafted with care and delivered fast straight to your table.
                    </p>
                </div>

                {/* Quick Navigation */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Company</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li>
                            <Link to="/" className="hover:text-[#FF4C24] transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <a href="/#explore-menu" className="hover:text-[#FF4C24] transition">
                                Menu
                            </a>
                        </li>
                        <li>
                            <Link to="/cart" className="hover:text-[#FF4C24] transition">
                                Cart
                            </Link>
                        </li>
                        <li>
                            <Link to="/myorders" className="hover:text-[#FF4C24] transition">
                                My Orders
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Details */}
                {/* Contact Details */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Contact Us</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li>Email: support@restoroots.com</li>
                        <li>Phone: +94 11 777 0000</li>
                        <li>Hours: Daily, 9:00 AM – 10:00 PM</li>
                    </ul>

                    <div className="flex items-center gap-4 pt-2">
                        {/* Facebook Logo */}
                        <a
                            href="https://facebook.com/your-restoroots-page"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="RestoRoots on Facebook"
                            className="text-gray-300 hover:text-[#FF4C24] transition"
                        >
                            <svg
                                className="w-5 h-5 fill-current"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                            </svg>
                        </a>

                        {/* Instagram Logo */}
                        <a
                            href="https://instagram.com/your-restoroots-handle"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="RestoRoots on Instagram"
                            className="text-gray-300 hover:text-[#FF4C24] transition"
                        >
                            <svg
                                className="w-5 h-5 fill-current"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.95 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z" />
                            </svg>
                        </a>
                        {/* TikTok Logo */}
                        <a
                            href="https://www.tiktok.com/@your-restoroots-handle"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="RestoRoots on TikTok"
                            className="text-gray-300 hover:text-[#FF4C24] transition"
                        >
                            <svg
                                className="w-5 h-5 fill-current"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <p className="max-w-[1280px] mx-auto pt-6 text-center text-xs text-gray-400">
                Copyright {new Date().getFullYear()} © RestoRoots. All rights reserved.
            </p>
        </footer>
    );
};