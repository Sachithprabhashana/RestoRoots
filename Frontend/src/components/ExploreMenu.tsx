import React from 'react';
import { menu_list } from '../assets/assets';

interface ExploreMenuProps {
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export const ExploreMenu: React.FC<ExploreMenuProps> = ({ category, setCategory }) => {
    return (
        <section className="w-full max-w-[1280px] mx-auto px-6 mt-12 flex flex-col gap-5" id="explore-menu">
            <h2 className="text-3xl font-semibold text-[#262626]">Explore our menu</h2>
            <p className="max-w-[650px] text-[#808080] text-[15px] leading-relaxed">
                Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>

            {/* Horizontal Category Row */}
            <div className="flex items-center justify-between gap-7 overflow-x-auto py-4 no-scrollbar">
                {menu_list.map((item, index) => {
                    const isSelected = category === item.menu_name;
                    return (
                        <div
                            key={index}
                            onClick={() => setCategory((prev) => (prev === item.menu_name ? 'All' : item.menu_name))}
                            className="flex flex-col items-center cursor-pointer shrink-0 group"
                        >
                            <img
                                src={item.menu_image}
                                alt={item.menu_name}
                                className={`w-24 h-24 md:w-28 md:h-28 rounded-full object-cover transition-all duration-200 ${isSelected
                                    ? 'border-4 border-[#FF4C24] p-1 scale-105'
                                    : 'group-hover:scale-105'
                                    }`}
                            />
                            <p
                                className={`mt-3 text-[16px] transition-colors ${isSelected ? 'text-[#FF4C24] font-semibold' : 'text-[#747474] font-normal'
                                    }`}
                            >
                                {item.menu_name}
                            </p>
                        </div>
                    );
                })}
            </div>

            <hr className="my-2 h-[2px] bg-[#e2e2e2] border-none" />
        </section>
    );
};