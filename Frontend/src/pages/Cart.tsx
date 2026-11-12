import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Trash2 } from 'lucide-react';

export const Cart: React.FC<{ navigateToCheckout: () => void }> = ({ navigateToCheckout }) => {
    const context = useContext(StoreContext);
    if (!context) return null;

    const { food_list, cartItems, removeFromCart, getTotalCartAmount } = context;
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const total = subtotal + deliveryFee;

    return (
        <div className="w-full max-w-[1280px] mx-auto px-6 py-12 pt-28">
            <h2 className="text-3xl font-bold text-[#262626] mb-8">Your Shopping Cart</h2>

            {subtotal === 0 ? (
                <div className="text-center py-20 text-gray-500 text-lg">Your cart is currently empty.</div>
            ) : (
                <div>
                    <div className="grid grid-cols-6 text-gray-500 font-medium text-sm pb-4 border-b border-gray-200">
                        <p>Items</p>
                        <p>Title</p>
                        <p>Price</p>
                        <p>Quantity</p>
                        <p>Total</p>
                        <p>Remove</p>
                    </div>

                    {food_list.map((item) => {
                        if (cartItems[item._id] > 0) {
                            return (
                                <div key={item._id} className="grid grid-cols-6 items-center py-4 border-b border-gray-100 text-gray-700 text-sm">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                    <p className="font-medium">{item.name}</p>
                                    <p>${item.price}.00</p>
                                    <p>{cartItems[item._id]}</p>
                                    <p className="font-semibold">${item.price * cartItems[item._id]}.00</p>
                                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 w-fit cursor-pointer">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            );
                        }
                        return null;
                    })}

                    <div className="mt-12 flex flex-col md:flex-row justify-between gap-12">
                        <div className="w-full md:w-[45%] bg-gray-50 p-8 rounded-2xl flex flex-col gap-4">
                            <h3 className="text-xl font-bold text-[#262626]">Cart Totals</h3>
                            <div className="flex justify-between text-gray-600">
                                <p>Subtotal</p>
                                <p>${subtotal}.00</p>
                            </div>
                            <hr className="bg-gray-200 border-none h-[1px]" />
                            <div className="flex justify-between text-gray-600">
                                <p>Delivery Fee</p>
                                <p>${deliveryFee}.00</p>
                            </div>
                            <hr className="bg-gray-200 border-none h-[1px]" />
                            <div className="flex justify-between font-bold text-lg text-[#262626]">
                                <p>Total</p>
                                <p>${total}.00</p>
                            </div>
                            <button
                                onClick={navigateToCheckout}
                                className="mt-4 bg-[#FF4C24] text-white py-3.5 rounded-full font-medium hover:bg-[#e03f1b] transition cursor-pointer shadow-md"
                            >
                                PROCEED TO CHECKOUT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};