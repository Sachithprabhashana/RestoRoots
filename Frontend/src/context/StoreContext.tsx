import React, { createContext, useState, } from 'react';
import { food_list } from '../assets/assets';

export interface FoodItemType {
    _id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    category: string;
}

interface StoreContextType {
    food_list: FoodItemType[];
    cartItems: { [key: string]: number };
    addToCart: (itemId: string) => void;
    removeFromCart: (itemId: string) => void;
    getTotalCartAmount: () => number;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const StoreContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

    const addToCart = (itemId: string) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
    };

    const removeFromCart = (itemId: string) => {
        setCartItems((prev) => {
            const updated = { ...prev };
            if (updated[itemId] > 1) {
                updated[itemId] -= 1;
            } else {
                delete updated[itemId];
            }
            return updated;
        });
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
    };

    return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};