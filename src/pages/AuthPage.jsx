import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSendOtp = (e) => {
        e.preventDefault();
        dispatch(sendOtp({ email })).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                setStep(2);
            }
        });
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        dispatch(verifyOtp({ email, otp }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4 sm:px-6">
            <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
                    {step === 1 ? 'Sign In / Register' : 'Verify OTP'}
                </h2>

                {error && <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 sm:py-3.5 mt-1 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 sm:py-3.5 text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:shadow-lg transition disabled:opacity-50 font-bold text-base sm:text-lg"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-5">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Code sent to <b className="text-gray-900 dark:text-white">{email}</b></p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter Verification Code</label>
                            <input
                                type="text"
                                required
                                value={otp}
                                placeholder="123456"
                                className="w-full px-4 py-3 sm:py-4 mt-1 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent text-center tracking-widest text-xl sm:text-2xl font-bold bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 sm:py-3.5 text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:shadow-lg transition disabled:opacity-50 font-bold text-base sm:text-lg"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm sm:text-base text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition py-2"
                        >
                            Change Email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
