import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserBookings } from '../redux/bookingSlice';

const MyBookingsPage = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { bookings, loading } = useSelector((state) => state.booking);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        } else {
            dispatch(fetchUserBookings());
        }
    }, [isAuthenticated, navigate, dispatch]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 pt-24 transition-colors duration-300">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Bookings</h2>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 text-center transition-colors duration-300">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No bookings yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        You haven't booked any services yet. Explore our categories to find the perfect vendor for your event.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 pt-24 transition-colors duration-300">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Bookings</h2>

            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition duration-300">

                        {/* Header with Vendor Name and Status */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {booking.vendorId?.name || "Unknown Vendor"}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Event Date: {new Date(booking.eventDate).toLocaleDateString('en-IN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                        </div>

                        {/* Booking Details */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Customer Details */}
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Customer Details</h4>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-900 dark:text-gray-200">
                                            <span className="font-medium">Name:</span> {booking.userName}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-200">
                                            <span className="font-medium">Email:</span> {booking.userEmail}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-200">
                                            <span className="font-medium">Phone:</span> {booking.userPhone}
                                        </p>
                                    </div>
                                </div>

                                {/* Vendor Details */}
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Vendor Details</h4>
                                    <div className="space-y-1">
                                        {booking.vendorId?.email && (
                                            <p className="text-sm text-gray-900 dark:text-gray-200">
                                                <span className="font-medium">Email:</span> {booking.vendorId.email}
                                            </p>
                                        )}
                                        {booking.vendorId?.phone && (
                                            <p className="text-sm text-gray-900 dark:text-gray-200">
                                                <span className="font-medium">Phone:</span> {booking.vendorId.phone}
                                            </p>
                                        )}
                                        {booking.vendorId?.price && (
                                            <p className="text-sm text-gray-900 dark:text-gray-200">
                                                <span className="font-medium">Price:</span> ₹{booking.vendorId.price}
                                                {booking.vendorId?.maxPrice && ` - ₹${booking.vendorId.maxPrice}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            {booking.notes && (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <h4 className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Special Requests</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                        {booking.notes}
                                    </p>
                                </div>
                            )}

                            {/* Booking ID and Created Date */}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Booking ID: {booking._id}</span>
                                <span>Created: {new Date(booking.createdAt || booking.eventDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookingsPage;