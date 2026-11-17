import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { FoodItem } from './FoodItem';

interface FoodDisplayProps {
    category: string;
}

export const FoodDisplay: React.FC<FoodDisplayProps> = ({ category }) => {
    const context = useContext(StoreContext);

    if (!context) return null;

    const { food_list } = context; // Pulls the live database items from context

    return (
        <section className="w-full max-w-[1280px] mx-auto px-6 my-10" id="food-display">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#262626] mb-8">
                Top dishes near you
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {food_list.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={item._id || index}
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

export default FoodDisplay;