import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';

export const AddItems: React.FC = () => {
    const context = useContext(StoreContext);
    const [image, setImage] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Salad');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!context) return;

        setMessage('');
        setErrorMsg('');

        if (!image) {
            setErrorMsg('Please select a food image.');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('name', name.trim());
            formData.append('description', description.trim());
            formData.append('category', category);
            formData.append('price', price);

            const response = await axios.post(`${context.url}/api/food/add`, formData, {
                headers: { token: context.token },
            });
            if (response.data.success) {
                setName('');
                setDescription('');
                setPrice('');
                setImage(null);
                setMessage('Food item added successfully!');
            } else {
                setErrorMsg(response.data.message || 'Failed to add item');
            }
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || 'Error adding food item');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="mb-6 text-xl font-bold text-gray-800">Add New Food Item</h2>

            <form onSubmit={onSubmitHandler} className="flex flex-col max-w-lg gap-5">
                <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">Upload Image</p>
                    <label
                        htmlFor="food-image"
                        className="w-36 h-28 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FF4C24] transition overflow-hidden"
                    >
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <>
                                <UploadCloud className="mb-1 text-gray-400 w-7 h-7" />
                                <span className="text-xs text-gray-500">Choose file</span>
                            </>
                        )}
                    </label>
                    <input
                        id="food-image"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Dish Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Mediterranean Bowl"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#FF4C24]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Write dish ingredients or highlights..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#FF4C24]"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#FF4C24] bg-white"
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Price ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="14.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#FF4C24]"
                        />
                    </div>
                </div>

                {message && <p className="text-sm font-medium text-green-600">{message}</p>}
                {errorMsg && <p className="text-sm font-medium text-red-500">{errorMsg}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#FF4C24] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#e03e1a] transition cursor-pointer w-fit disabled:opacity-60"
                >
                    {submitting ? 'Adding...' : 'ADD ITEM'}
                </button>
            </form>
        </div>
    );
};

export default AddItems;