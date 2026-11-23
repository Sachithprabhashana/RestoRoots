import React, { useContext, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';

interface LoginPopupProps {
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ setShowLogin }) => {
    const context = useContext(StoreContext);
    const [currState, setCurrState] = useState<'Login' | 'Sign Up'>('Login');
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!context) return;

        setErrorMsg('');
        setLoading(true);

        const endpoint =
            currState === 'Login' ? '/api/user/login' : '/api/user/register';

        try {
            const response = await axios.post(`${context.url}${endpoint}`, data);
            if (response.data.success) {
                const adminFlag = Boolean(
                    response.data.isAdmin ?? response.data.user?.isAdmin
                );
                context.setToken(response.data.token);
                context.setIsAdmin(adminFlag);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('isAdmin', String(adminFlag));
                setShowLogin(false);
            } else {
                setErrorMsg(response.data.message || 'Authentication failed');
            }
        } catch (error: any) {
            setErrorMsg(
                error.response?.data?.message || 'Unable to connect to server'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60">
            <form
                onSubmit={onSubmitHandler}
                className="relative w-full max-w-md p-6 bg-white shadow-xl rounded-2xl sm:p-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{currState}</h2>
                    <button
                        type="button"
                        onClick={() => setShowLogin(false)}
                        className="text-gray-400 cursor-pointer hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {currState === 'Sign Up' && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            value={data.name}
                            onChange={onChangeHandler}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#FF4C24]"
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        value={data.email}
                        onChange={onChangeHandler}
                        required
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#FF4C24]"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 8 characters)"
                        value={data.password}
                        onChange={onChangeHandler}
                        required
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#FF4C24]"
                    />
                </div>

                {errorMsg && (
                    <p className="mt-3 text-xs font-medium text-red-500">{errorMsg}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-5 bg-[#FF4C24] text-white py-3 rounded-xl font-semibold hover:bg-[#e03e1a] transition cursor-pointer disabled:opacity-60"
                >
                    {loading
                        ? 'Please wait...'
                        : currState === 'Sign Up'
                            ? 'Create account'
                            : 'Login'}
                </button>

                <div className="mt-5 text-sm text-gray-600">
                    {currState === 'Login' ? (
                        <p>
                            Create a new account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setErrorMsg('');
                                    setCurrState('Sign Up');
                                }}
                                className="text-[#FF4C24] font-semibold hover:underline cursor-pointer"
                            >
                                Click here
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setErrorMsg('');
                                    setCurrState('Login');
                                }}
                                className="text-[#FF4C24] font-semibold hover:underline cursor-pointer"
                            >
                                Login here
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginPopup;