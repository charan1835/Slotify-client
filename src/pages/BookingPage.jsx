import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { addBooking } from '../redux/bookingSlice';

const API = axios.create({
    baseURL: 'https://slotify-server.vercel.app',
});

// Add authorization token to requests
API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');
    if (profile) {
        req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
    }
    return req;
});

const BookingPage = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        eventDate: '',
        notes: '',
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        if (user) {
            setFormData(prev => ({
                ...prev,
                userName: user.name || '',
                userEmail: user.email || '',
                userPhone: user.phone || ''
            }));
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                // If it's a fake ID (demo mode), handle it gracefully or Mock it
                // For now, let's try to fetch. If it fails (404/500), we might need to fallback if we are in demo mode.
                // However, since we seeded the DB, we should be fine!
                const { data } = await API.get(`/vendors/${vendorId}`);
                setVendor(data);
            } catch (err) {
                console.error("Failed to fetch vendor", err);
                setError("Vendor not found or server error.");
            } finally {
                setLoading(false);
            }
        };

        if (vendorId) {
            fetchVendor();
        }
    }, [vendorId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        try {
            // 1. Create Order
            const orderUrl = "https://slotify-server.vercel.app/payments/orders";
            const { data: order } = await axios.post(orderUrl, { amount: vendor.price });

            const options = {
                key: "rzp_test_S71JJCHJsHAhHl", // Enter the Key ID generated from the Dashboard
                amount: order.amount,
                currency: order.currency,
                name: "Slotify Event Booking",
                description: `Booking for ${vendor.name}`,
                image: "https://example.com/your_logo", // You can replace this with your logo URL
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 2. Verify Payment
                        const verifyUrl = "https://slotify-server.vercel.app/payments/verify";
                        const { data: verifyData } = await axios.post(verifyUrl, response);

                        // 3. Create Booking if verified
                        if (verifyData.message === "Payment verified successfully") {
                            await createBooking();
                        } else {
                            alert("Payment verification failed!");
                        }
                    } catch (error) {
                        console.error("Payment Verification Error", error);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: formData.userName,
                    email: formData.userEmail,
                    contact: formData.userPhone,
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#0f172a", // Match slate-900
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on("payment.failed", function (response) {
                alert(response.error.description);
            });
            rzp1.open();
        } catch (error) {
            console.error("Payment Order Creation Error", error);
            alert("Could not initiate payment. Server error.");
        }
    };

    const createBooking = async () => {
        try {
            await API.post("/bookings", {
                vendorId,
                ...formData,
                status: "confirmed", // Since payment is successful
            });
            alert("Booking confirmed! Payment Successful.");
            navigate('/my-bookings');
        } catch (err) {
            console.error("Booking creation failed after payment", err);
            alert("Payment successful but booking creation failed. Please contact support.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Trigger Payment Flow
        handlePayment();
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full"></div></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!vendor) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
                    {/* Mobile/Tablet: Stacked Layout, Desktop: Side-by-side */}
                    <div className="flex flex-col md:flex-row">
                        {/* Vendor Info Side */}
                        <div className="md:w-2/5 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-white p-6 sm:p-8 relative overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -ml-20 -mb-20"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">
                                        ✨
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Booking Details</p>
                                        <h2 className="text-2xl sm:text-3xl font-bold">{vendor.name}</h2>
                                    </div>
                                </div>

                                <div className="flex items-center mb-6 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 w-fit">
                                    <span className="text-xl mr-2">★</span>
                                    <span className="font-bold text-lg">{vendor.rating || 4.5}</span>
                                    <span className="text-white/70 text-sm ml-1">/5</span>
                                </div>

                                <div className="space-y-3 text-white/90">
                                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                        <span className="text-lg mt-0.5">💰</span>
                                        <div>
                                            <p className="text-white/60 text-xs uppercase font-medium mb-1">Price Range</p>
                                            <p className="font-bold">₹{vendor.price} - ₹{vendor.maxPrice}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                        <span className="text-lg mt-0.5">📧</span>
                                        <div>
                                            <p className="text-white/60 text-xs uppercase font-medium mb-1">Email</p>
                                            <p className="font-medium text-sm break-all">{vendor.email || "Contact vendor"}</p>
                                        </div>
                                    </div>
                                    {vendor.phone && (
                                        <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                            <span className="text-lg mt-0.5">📱</span>
                                            <div>
                                                <p className="text-white/60 text-xs uppercase font-medium mb-1">Phone</p>
                                                <p className="font-medium">{vendor.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Booking Form Side */}
                        <div className="md:w-3/5 p-6 sm:p-8 lg:p-12">
                            <div className="mb-6 sm:mb-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete your Booking</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Fill in the details below to secure your date.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="userName"
                                            required
                                            value={formData.userName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-violet-500 dark:focus:border-violet-400 focus:ring-0 transition outline-none"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="userPhone"
                                            required
                                            value={formData.userPhone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-violet-500 dark:focus:border-violet-400 focus:ring-0 transition outline-none"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="userEmail"
                                        required
                                        value={formData.userEmail}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-violet-500 dark:focus:border-violet-400 focus:ring-0 transition outline-none"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Date</label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        required
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-violet-500 dark:focus:border-violet-400 focus:ring-0 transition outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Requests (Optional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-violet-500 dark:focus:border-violet-400 focus:ring-0 transition outline-none resize-none"
                                        placeholder="Any specific requirements or questions..."
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2 text-base sm:text-lg"
                                    >
                                        <span>💳</span>
                                        Pay & Confirm Booking
                                    </button>
                                    <p className="text-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                                        🔒 Secure payment powered by Razorpay
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
