import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

export const Cart: React.FC = () => {
    const context = useContext(StoreContext);
    const navigate = useNavigate();

    if (!context) return null;

    const { food_list, cartItems, addToCart, removeFromCart, getTotalCartAmount } = context;
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const total = subtotal + deliveryFee;

    return (
        <div className="w-full max-w-[1280px]  mx-auto px-6 pt-30 pb-12">
            <h1 className="mb-8 text-2xl font-semibold text-gray-800 md:text-3xl">Your Cart</h1>

            {subtotal === 0 ? (
                <div className="p-10 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <p className="mb-4 text-lg text-gray-500">Your cart is currently empty.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#FF4C24] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#e03e1a] transition cursor-pointer"
                    >
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Cart Items List */}
                    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm lg:col-span-2 rounded-2xl">
                        <div className="hidden grid-cols-6 gap-4 p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase sm:grid bg-gray-50">
                            <span className="col-span-2">Item</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Total</span>
                            <span className="text-right">Action</span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {food_list.map((item) => {
                                const quantity = cartItems[item._id] || 0;
                                if (quantity === 0) return null;

                                return (
                                    <div
                                        key={item._id}
                                        className="grid items-center grid-cols-1 gap-4 p-4 sm:grid-cols-6"
                                    >
                                        <div className="flex items-center gap-3 sm:col-span-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="object-cover bg-gray-100 w-14 h-14 rounded-xl"
                                            />
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                        </div>

                                        <span className="text-gray-600">${item.price.toFixed(2)}</span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-1 text-gray-700 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="w-6 text-sm font-medium text-center">{quantity}</span>
                                            <button
                                                onClick={() => addToCart(item._id)}
                                                className="p-1 text-gray-700 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <span className="font-semibold text-gray-800">
                                            ${(item.price * quantity).toFixed(2)}
                                        </span>

                                        <div className="sm:text-right">
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer"
                                                title="Remove one"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cart Totals Summary */}
                    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl h-fit">
                        <h2 className="mb-6 text-xl font-semibold text-gray-800">Cart Totals</h2>

                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span>Delivery Fee</span>
                                <span className="font-medium text-gray-800">${deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-3 text-base font-bold text-gray-900">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/order')}
                            className="w-full mt-6 bg-[#FF4C24] text-white py-3 rounded-xl font-semibold hover:bg-[#e03e1a] transition cursor-pointer"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;