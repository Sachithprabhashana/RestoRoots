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

    const { cartItems, addToCart, removeFromCart, url } = context;
    const itemCount = cartItems[id] || 0;

    const baseUrl = (url || 'http://localhost:4000').replace(/\/+$/, '');
    const imgSrc = !image
        ? ''
        : image.startsWith('http://') ||
            image.startsWith('https://') ||
            image.startsWith('data:') ||
            image.startsWith('/')
            ? image
            : `${baseUrl}/images/${encodeURIComponent(image)}`;

    return (
        <div className="flex flex-col justify-between overflow-hidden transition duration-300 bg-white border border-gray-100 shadow-md rounded-2xl hover:shadow-xl">
            <div className="relative w-full overflow-hidden bg-gray-100 h-52">
                <img className="object-cover w-full h-full transition duration-500 hover:scale-105" src={imgSrc} alt={name} />

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
                            className="text-red-500 transition cursor-pointer hover:scale-110"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold text-gray-800">{itemCount}</span>
                        <button
                            onClick={() => addToCart(id)}
                            className="text-green-600 transition cursor-pointer hover:scale-110"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold tracking-tight text-gray-800">{name}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-xs font-medium text-gray-600">4.8</span>
                    </div>
                </div>
                <p className="text-xs leading-relaxed text-gray-500 line-clamp-2">{description}</p>
                <p className="text-[#FF4C24] text-xl font-bold mt-1">${price}.00</p>
            </div>
        </div>
    );
};