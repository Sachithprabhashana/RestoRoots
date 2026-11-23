import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { FoodItem } from './FoodItem';

interface FoodDisplayProps {
    category: string;
}

export const FoodDisplay: React.FC<FoodDisplayProps> = ({ category }) => {
    const context = useContext(StoreContext);

    if (!context) return null;

    const { food_list, searchQuery, setSearchQuery } = context; // Pulls the live database items and search state from context

    const query = searchQuery.trim().toLowerCase();

    const filteredFoods = food_list.filter((item) => {
        const matchesCategory = category === "All" || category === item.category;
        const matchesSearch =
            !query ||
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    return (
        <section className="w-full max-w-[1280px] mx-auto px-6 my-10" id="food-display">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#262626]">
                    {query ? `Results for "${searchQuery.trim()}"` : "Top dishes near you"}
                </h2>
                {query && (
                    <span className="text-sm text-[#49557e]">
                        {filteredFoods.length} {filteredFoods.length === 1 ? "dish" : "dishes"} found
                    </span>
                )}
            </div>

            {filteredFoods.length === 0 ? (
                <div className="py-12 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <p className="text-base font-medium text-[#262626]">No dishes matched your search.</p>
                    <p className="mt-1 text-sm text-[#49557e]">
                        Try another keyword or clear your search query.
                    </p>
                    {query && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="mt-4 px-5 py-2 text-sm font-medium text-white bg-[#FF4C24] rounded-full hover:opacity-90 transition cursor-pointer"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredFoods.map((item, index) => (
                        <FoodItem
                            key={item._id || index}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default FoodDisplay;