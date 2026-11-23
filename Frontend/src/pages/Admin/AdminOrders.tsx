import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';

interface AdminOrderItem {
    name: string;
    quantity: number;
}

interface AdminOrderAddress {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
}

interface AdminOrderType {
    _id: string;
    items: AdminOrderItem[];
    amount: number;
    address?: AdminOrderAddress;
    status: string;
    payment: boolean;
}

export const AdminOrders: React.FC = () => {
    const context = useContext(StoreContext);
    const [orders, setOrders] = useState<AdminOrderType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        if (!context) return;
        setLoading(true);
        try {
            const response = await axios.get(`${context.url}/api/order/list`, {
                headers: { token: context.token },
            });
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (orderId: string, newStatus: string) => {
        if (!context) return;
        try {
            const response = await axios.post(
                `${context.url}/api/order/status`,
                { orderId, status: newStatus },
                { headers: { token: context.token } }
            );
            if (response.data.success) {
                await fetchAllOrders();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    useEffect(() => {
        if (!context?.token) return;
        let ignore = false;

        const loadOrders = async () => {
            try {
                const response = await axios.get(`${context.url}/api/order/list`, {
                    headers: { token: context.token },
                });
                if (!ignore && response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        void loadOrders();
        return () => {
            ignore = true;
        };
    }, [context?.token, context?.url]);

    return (
        <div>
            <h2 className="mb-6 text-xl font-bold text-gray-800">Customer Orders</h2>

            {loading ? (
                <p className="text-sm text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
                <p className="text-sm text-gray-500">No customer orders yet.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-gray-200 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-[0.4fr_2.4fr_1fr_1fr_1.3fr] items-center gap-4 text-sm text-gray-700"
                        >
                            <Package className="w-8 h-8 text-[#FF4C24]" />

                            <div>
                                <p className="font-semibold text-gray-800">
                                    {order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}
                                </p>
                                {order.address && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        {order.address.firstName} {order.address.lastName} — {order.address.street},{' '}
                                        {order.address.city}
                                    </p>
                                )}
                            </div>

                            <p className="font-semibold text-gray-900">${Number(order.amount).toFixed(2)}</p>

                            <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${order.payment
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                {order.payment ? 'Paid' : 'Pending'}
                            </span>

                            <select
                                value={order.status || 'Food Processing'}
                                onChange={(e) => statusHandler(order._id, e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#FF4C24] cursor-pointer"
                            >
                                <option value="Food Processing">Food Processing</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;