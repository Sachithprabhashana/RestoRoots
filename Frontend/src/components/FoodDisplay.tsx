import React from 'react';
import { food_list } from '../assets/assets';
import { FoodItem } from './FoodItem';

interface FoodDisplayProps {
    category: string;
}

export const FoodDisplay: React.FC<FoodDisplayProps> = ({ category }) => {
    return (
        <section className="w-full max-w-[1280px] mx-auto px-6 my-10" id="food-display">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#262626] mb-8">
                Top dishes near you
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {food_list.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={index}
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </section>
    );
};