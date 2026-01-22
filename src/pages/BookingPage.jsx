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

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!vendor) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
                    <div className="md:flex">
                        {/* Vendor Info Side */}
                        <div className="md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-2">{vendor.name}</h2>
                                <div className="flex items-center mb-6 text-yellow-400">
                                    <span className="text-xl mr-1">★</span>
                                    <span className="font-medium">{vendor.rating || 4.5}</span>
                                </div>
                                <div className="space-y-4 text-gray-300">
                                    <p className="flex items-center">
                                        <span className="mr-3 text-lg">💰</span>
                                        ₹{vendor.price} - ₹{vendor.maxPrice}
                                    </p>
                                    <p className="flex items-center">
                                        <span className="mr-3 text-lg">📧</span>
                                        {vendor.email || "Contact vendor"}
                                    </p>
                                    {vendor.phone && (
                                        <p className="flex items-center">
                                            <span className="mr-3 text-lg">📱</span>
                                            {vendor.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Decorative Circle */}
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-slate-800 rounded-full opacity-50"></div>
                        </div>

                        {/* Booking Form Side */}
                        <div className="md:w-2/3 p-8 md:p-12">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complete your Booking</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to secure your date.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="userName"
                                            required
                                            value={formData.userName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:ring-0 transition outline-none"
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
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:ring-0 transition outline-none"
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
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:ring-0 transition outline-none"
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
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:ring-0 transition outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Requests (Optional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:ring-0 transition outline-none resize-none"
                                        placeholder="Any specific requirements or questions..."
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-gray-200 transform hover:-translate-y-0.5 transition duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Pay & Confirm Booking
                                    </button>
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
