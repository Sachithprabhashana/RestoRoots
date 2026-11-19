import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';

export const Verify: React.FC = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const context = useContext(StoreContext);
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!context || !orderId) return;

            try {
                const response = await axios.post(`${context.url}/api/order/verify`, {
                    success,
                    orderId,
                });

                if (response.data.success) {
                    context.clearCart();
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('failed');
            }
        };

        verifyPayment();
    }, [orderId, success]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
            {status === 'loading' && (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-gray-200 border-t-[#FF4C24] rounded-full animate-spin" />
                    <p className="font-medium text-gray-600">Verifying your payment...</p>
                </div>
            )}

            {status === 'success' && (
                <div className="w-full max-w-md p-8 text-center bg-white border border-gray-100 shadow-sm rounded-2xl sm:p-10">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">Order Confirmed!</h2>
                    <p className="mb-6 text-sm text-gray-500">
                        Thank you for your payment. Your order{' '}
                        <span className="font-mono text-gray-700">#{orderId?.slice(-6)}</span> is now being
                        prepared.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-[#FF4C24] text-white py-3 rounded-xl font-semibold hover:bg-[#e03e1a] transition cursor-pointer"
                    >
                        Back to Menu
                    </button>
                </div>
            )}

            {status === 'failed' && (
                <div className="w-full max-w-md p-8 text-center bg-white border border-gray-100 shadow-sm rounded-2xl sm:p-10">
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">Payment Cancelled</h2>
                    <p className="mb-6 text-sm text-gray-500">
                        Your payment was not completed. No charges were made.
                    </p>
                    <button
                        onClick={() => navigate('/cart')}
                        className="w-full bg-[#FF4C24] text-white py-3 rounded-xl font-semibold hover:bg-[#e03e1a] transition cursor-pointer"
                    >
                        Return to Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default Verify;