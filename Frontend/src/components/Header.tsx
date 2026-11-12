import React from 'react';

export const Header: React.FC = () => {
    return (
        <div className="w-full max-w-[1280px] mx-auto px-6">
            <div
                className="relative w-full h-[38vw] min-h-[380px] max-h-[520px] rounded-3xl overflow-hidden bg-cover bg-center shadow-md flex items-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600')",
                }}
            >
                {/* Warm Orange Gradient Overlay for high text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4C24]/95 via-[#FF4C24]/75 to-black/20"></div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-[620px] px-8 md:px-14 flex flex-col items-start gap-5 text-white">
                    <h1 className="text-4xl sm:text-5xl md:text-[56px] font-semibold leading-[1.12] tracking-tight">
                        Order your favourite food here
                    </h1>
                    <p className="text-sm md:text-[15px] text-white/95 leading-relaxed font-light hidden sm:block">
                        Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
                    </p>
                    <a
                        href="#explore-menu"
                        className="mt-1 bg-white text-[#747474] font-medium text-sm md:text-[15px] px-8 py-3.5 rounded-full shadow-sm hover:bg-gray-50 hover:text-gray-900 transition"
                    >
                        View Menu
                    </a>
                </div>
            </div>
        </div>
    );
};