// import React, { useContext, useState } from 'react';
// import { StoreContext } from '../context/StoreContext';

// export const PlaceOrder: React.FC = () => {
//     const context = useContext(StoreContext);

//     const [data, setData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         street: '',
//         city: '',
//         state: '',
//         zipcode: '',
//         country: '',
//         phone: '',
//     });

//     if (!context) return null;

//     const { getTotalCartAmount } = context;
//     const subtotal = getTotalCartAmount();
//     const deliveryFee = subtotal === 0 ? 0 : 2;
//     const total = subtotal + deliveryFee;

//     const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setData((prev) => ({ ...prev, [name]: value }));
//     };

//     const placeOrder = async (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log('Order Delivery Data:', data);
//         // We will connect the Stripe checkout API call here next!
//         alert('Delivery info captured! Ready to connect Stripe payment.');
//     };

//     return (
//         <form
//             onSubmit={placeOrder}
//             className="w-full max-w-[1280px] mx-auto px-6 my-12 grid grid-cols-1 lg:grid-cols-3 gap-10"
//         >
//             {/* Left Side: Delivery Information */}
//             <div className="p-6 bg-white border border-gray-100 shadow-sm lg:col-span-2 rounded-2xl sm:p-8">
//                 <h2 className="mb-6 text-2xl font-semibold text-gray-800">Delivery Information</h2>

//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <input
//                             required
//                             name="firstName"
//                             value={data.firstName}
//                             onChange={onChangeHandler}
//                             type="text"
//                             placeholder="First name"
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
//                         />
//                         <input
//                             required
//                             name="lastName"
//                             value={data.lastName}
//                             onChange={onChangeHandler}
//                             type="text"
//                             placeholder="Last name"
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
//                         />
//                     </div>

//                     <input
//                         required
//                         name="email"
//                         value={data.email}
//                         onChange={onChangeHandler}
//                         type="email"
//                         placeholder="Email address"
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
//                     />

//                     <input
//                         required
//                         name="street"
//                         value={data.street}
//                         onChange={onChangeHandler}
//                         type="text"
//                         placeholder="Street address"
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
//                     />

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <input
//                             required
//                             name="city"
//                             value={data.city}
//                             onChange={onChangeHandler}
//                             type="text"
//                             placeholder="City"
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
//                         />
//                         <input
//                             required
//                             name="state"
//                             value={data.state}
//                             onChange={onChangeHandler}
//                             type="text"
//                             placeholder="State / Province"
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
//                         />
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <input
//                             required
//                             name="zipcode"
//                             value={data.zipcode}
//                             onChange={onChangeHandler}
//                             type="text"
//                             placeholder="Zip / Postal code"
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
//                         />
//                         <input
//                             required
//                             name="country"
//                             value={data.country}
//                             onChange={onChangeHandler}
//                             type="text"
//                             placeholder="Country"
//                             className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
//                         />
//                     </div>

//                     <input
//                         required
//                         name="phone"
//                         value={data.phone}
//                         onChange={onChangeHandler}
//                         type="tel"
//                         placeholder="Phone number"
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
//                     />
//                 </div>
//             </div>

//             {/* Right Side: Cart Totals */}
//             <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl sm:p-8 h-fit">
//                 <h2 className="mb-6 text-xl font-semibold text-gray-800">Cart Totals</h2>

//                 <div className="space-y-3 text-sm text-gray-600">
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                         <span>Subtotal</span>
//                         <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                         <span>Delivery Fee</span>
//                         <span className="font-medium text-gray-800">${deliveryFee.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between py-3 text-base font-bold text-gray-900">
//                         <span>Total</span>
//                         <span>${total.toFixed(2)}</span>
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full mt-6 bg-[#FF4C24] text-white py-3 rounded-xl font-semibold hover:bg-[#e03e1a] transition cursor-pointer"
//                 >
//                     Proceed to Payment
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default PlaceOrder;

import React, { useContext, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

export const PlaceOrder: React.FC = () => {
    const context = useContext(StoreContext);

    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    if (!context) return null;

    const { food_list, cartItems, getTotalCartAmount, url } = context;
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const total = subtotal + deliveryFee;

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const placeOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        const orderItems = food_list
            .filter((item) => cartItems[item._id] > 0)
            .map((item) => ({
                _id: item._id,
                name: item.name,
                price: item.price,
                quantity: cartItems[item._id],
            }));

        const orderData = {
            address: data,
            items: orderItems,
            amount: total,
        };

        try {
            const response = await axios.post(`${url}/api/order/place`, orderData);
            if (response.data.success && response.data.session_url) {
                window.location.replace(response.data.session_url);
            } else {
                alert('Could not start payment session.');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            alert('Error placing order. Please try again.');
        }
    };

    return (
        <form
            onSubmit={placeOrder}
            className="w-full max-w-[1280px] mx-auto px-6 my-12 grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
            {/* Left Side: Delivery Information */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm lg:col-span-2 rounded-2xl sm:p-8">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800">Delivery Information</h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input
                            required
                            name="firstName"
                            value={data.firstName}
                            onChange={onChangeHandler}
                            type="text"
                            placeholder="First name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
                        />
                        <input
                            required
                            name="lastName"
                            value={data.lastName}
                            onChange={onChangeHandler}
                            type="text"
                            placeholder="Last name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
                        />
                    </div>

                    <input
                        required
                        name="email"
                        value={data.email}
                        onChange={onChangeHandler}
                        type="email"
                        placeholder="Email address"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
                    />

                    <input
                        required
                        name="street"
                        value={data.street}
                        onChange={onChangeHandler}
                        type="text"
                        placeholder="Street address"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input
                            required
                            name="city"
                            value={data.city}
                            onChange={onChangeHandler}
                            type="text"
                            placeholder="City"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
                        />
                        <input
                            required
                            name="state"
                            value={data.state}
                            onChange={onChangeHandler}
                            type="text"
                            placeholder="State / Province"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input
                            required
                            name="zipcode"
                            value={data.zipcode}
                            onChange={onChangeHandler}
                            type="text"
                            placeholder="Zip / Postal code"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
                        />
                        <input
                            required
                            name="country"
                            value={data.country}
                            onChange={onChangeHandler}
                            type="text"
                            placeholder="Country"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
                        />
                    </div>

                    <input
                        required
                        name="phone"
                        value={data.phone}
                        onChange={onChangeHandler}
                        type="tel"
                        placeholder="Phone number"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#FF4C24]"
                    />
                </div>
            </div>

            {/* Right Side: Cart Totals */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl sm:p-8 h-fit">
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
                    type="submit"
                    className="w-full mt-6 bg-[#FF4C24] text-white py-3 rounded-xl font-semibold hover:bg-[#e03e1a] transition cursor-pointer"
                >
                    Proceed to Payment
                </button>
            </div>
        </form>
    );
};

export default PlaceOrder;