import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export interface FoodItemType {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

interface StoreContextType {
    food_list: FoodItemType[];
    cartItems: { [key: string]: number };
    addToCart: (itemId: string) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    getTotalCartAmount: () => number;
    url: string;
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    isAdmin: boolean;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    isSearchOpen: boolean;
    setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const StoreContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
    const [token, setToken] = useState<string>(
        () => localStorage.getItem('token') || ''
    );
    const [isAdmin, setIsAdmin] = useState<boolean>(
        () => localStorage.getItem('isAdmin') === 'true'
    );
    const [food_list, setFoodList] = useState<FoodItemType[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const url = "http://localhost:4000";

    const addToCart = (itemId: string) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
    };

    const removeFromCart = (itemId: string) => {
        setCartItems((prev) => {
            if (!prev[itemId]) return prev;
            const updatedCart = { ...prev };
            if (updatedCart[itemId] > 1) {
                updatedCart[itemId] -= 1;
            } else {
                delete updatedCart[itemId];
            }
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCartItems({});
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

    useEffect(() => {
        const fetchFoodList = async () => {
            try {
                const response = await axios.get(`${url}/api/food/list`);
                setFoodList(response.data.data);
            } catch (error) {
                console.error("Error fetching food list:", error);
            }
        };

        fetchFoodList();
    }, []);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedAdmin = localStorage.getItem('isAdmin') === 'true';
        if (savedToken) {
            setToken(savedToken);
            setIsAdmin(savedAdmin);
        } else {
            setIsAdmin(false);
        }
    }, []);

    const contextValue: StoreContextType = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        isAdmin,
        setIsAdmin,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};