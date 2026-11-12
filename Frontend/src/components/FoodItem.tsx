import React, { useContext } from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';

interface FoodItemProps {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
}

export const FoodItem: React.FC<FoodItemProps> = ({ id, name, price, description, image }) => {
    const context = useContext(StoreContext);
    if (!context) return null;

    const { cartItems, addToCart, removeFromCart } = context;
    const itemCount = cartItems[id] || 0;

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between border border-gray-100">
            <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                <img className="w-full h-full object-cover hover:scale-105 transition duration-500" src={image} alt={name} />

                {itemCount === 0 ? (
                    <button
                        onClick={() => addToCart(id)}
                        className="absolute bottom-4 right-4 bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-50 transition cursor-pointer"
                    >
                        <Plus className="w-5 h-5 text-gray-800" />
                    </button>
                ) : (
                    <div className="absolute bottom-4 right-4 bg-white flex items-center gap-3 px-3 py-1.5 rounded-full shadow-lg">
                        <button
                            onClick={() => removeFromCart(id)}
                            className="cursor-pointer text-red-500 hover:scale-110 transition"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-gray-800 text-sm">{itemCount}</span>
                        <button
                            onClick={() => addToCart(id)}
                            className="cursor-pointer text-green-600 hover:scale-110 transition"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 tracking-tight">{name}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-xs font-medium text-gray-600">4.8</span>
                    </div>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{description}</p>
                <p className="text-[#FF4C24] text-xl font-bold mt-1">${price}.00</p>
            </div>
        </div>
    );
};