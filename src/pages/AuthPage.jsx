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
        <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-center">
                    {step === 1 ? 'Sign In / Register' : 'Verify OTP'}
                </h2>

                {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                placeholder="name@example.com"
                                className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-white bg-black rounded-xl hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-4">Code sent to <b>{email}</b></p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter Verification Code</label>
                            <input
                                type="text"
                                required
                                value={otp}
                                placeholder="123456"
                                className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center tracking-widest text-xl"
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-white bg-black rounded-xl hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-gray-500 hover:text-black transition"
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
