import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';

interface FoodItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

export const ListItems: React.FC = () => {
    const context = useContext(StoreContext);
    const [list, setList] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchList = async () => {
        if (!context) return;
        setLoading(true);
        try {
            const response = await axios.get(`${context.url}/api/food/list`);
            if (response.data.success) {
                setList(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching food list:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFood = async (foodId: string) => {
        if (!context) return;
        try {
            const response = await axios.post(
                `${context.url}/api/food/remove`,
                { id: foodId },
                { headers: { token: context.token } }
            );
            if (response.data.success) {
                await fetchList();
            }
        } catch (error) {
            console.error('Error removing food:', error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div>
            <h2 className="mb-6 text-xl font-bold text-gray-800">All Menu Items</h2>

            {loading ? (
                <p className="text-sm text-gray-500">Loading menu items...</p>
            ) : list.length === 0 ? (
                <p className="text-sm text-gray-500">No food items found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-200">
                                <th className="py-3 pr-4">Image</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="py-3 pl-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item) => (
                                <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 pr-4">
                                        <img
                                            src={
                                                item.image?.startsWith('http')
                                                    ? item.image
                                                    : `${context?.url}/images/${item.image}`
                                            }
                                            alt={item.name}
                                            className="object-cover w-12 h-12 bg-gray-100 rounded-lg"
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.category}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-900">
                                        ${Number(item.price).toFixed(2)}
                                    </td>
                                    <td className="py-3 pl-4 text-right">
                                        <button
                                            onClick={() => removeFood(item._id)}
                                            title="Delete item"
                                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                        >
                                            <Trash2 className="inline w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ListItems;