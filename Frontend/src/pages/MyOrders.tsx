import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface OrderType {
    _id: string;
    items: OrderItem[];
    amount: number;
    status: string;
    payment: boolean;
}

export const MyOrders: React.FC = () => {
    const context = useContext(StoreContext);
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchOrders = async () => {
        if (!context?.token) return;
        setLoading(true);
        try {
            const response = await axios.post(
                `${context.url}/api/order/userorders`,
                {},
                { headers: { token: context.token } }
            );
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (context?.token) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [context?.token]);

    return (
        <div className="max-w-[1280px] mx-auto px-6 pt-32 pb-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">My Orders</h2>

            {loading ? (
                <p className="text-gray-500">Loading your orders...</p>
            ) : orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white border border-gray-100 rounded-2xl">
                    No orders found yet.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-xl p-5 border border-gray-200 grid grid-cols-1 md:grid-cols-[0.5fr_2.5fr_1fr_1fr_1.2fr_1fr] items-center gap-4 text-sm text-gray-700"
                        >
                            <Package className="w-10 h-10 text-[#FF4C24]" />

                            <p className="font-medium text-gray-800">
                                {order.items
                                    .map((item) => `${item.name} x ${item.quantity}`)
                                    .join(', ')}
                            </p>

                            <p className="font-semibold text-gray-900">${order.amount.toFixed(2)}</p>

                            <p>Items: {order.items.length}</p>

                            <p className="flex items-center gap-2 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4C24]" />
                                <span>{order.status || 'Food Processing'}</span>
                            </p>

                            <button
                                onClick={fetchOrders}
                                className="bg-[#fff4f2] text-[#FF4C24] border border-[#FF4C24]/30 px-4 py-2 rounded-lg font-medium hover:bg-[#ffe6e1] transition cursor-pointer"
                            >
                                Track Order
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;