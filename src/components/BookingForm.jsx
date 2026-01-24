import React, { useState } from "react";

const BookingForm = ({ isOpen, onClose, onSubmit, vendorName, initialData }) => {
    const [formData, setFormData] = useState({
        userName: initialData?.name || "",
        userEmail: initialData?.email || "",
        userPhone: initialData?.phone || "",
        eventDate: "",
        notes: "",
    });

    const [focusedField, setFocusedField] = useState(null);

    // Update state when initialData changes or modal opens
    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData(prev => ({
                ...prev,
                userName: initialData.name || "",
                userEmail: initialData.email || "",
                userPhone: initialData.phone || ""
            }));
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 booking-form-overlay">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/20 to-pink-600/20 backdrop-blur-sm animate-gradient"></div>

            {/* Modal container with glassmorphism */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-xl border border-white/20 overflow-hidden booking-form-card">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 opacity-90"></div>
                <div className="absolute top-0 left-0 right-0 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-300 flex items-center justify-center hover:rotate-90 transform font-light text-2xl border border-white/30"
                >
                    ✕
                </button>

                {/* Header section */}
                <div className="relative pt-8 pb-6 px-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Book Your Service</h2>
                            <p className="text-white/80 text-sm font-medium mt-0.5">
                                Reserve your spot with <span className="font-bold">{vendorName}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form section with glassmorphism card */}
                <div className="relative bg-white/80 backdrop-blur-md rounded-t-3xl p-8 shadow-inner">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="relative">
                            <label
                                className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'userName' || formData.userName
                                        ? 'top-1 text-xs text-violet-600 font-semibold'
                                        : 'top-4 text-sm text-gray-500'
                                    }`}
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="userName"
                                required
                                value={formData.userName}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('userName')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full px-4 pt-6 pb-2 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all duration-300 text-gray-800 font-medium shadow-sm hover:shadow-md hover:border-gray-300"
                            />
                            <div className="absolute right-4 top-4 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="relative">
                            <label
                                className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'userEmail' || formData.userEmail
                                        ? 'top-1 text-xs text-violet-600 font-semibold'
                                        : 'top-4 text-sm text-gray-500'
                                    }`}
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="userEmail"
                                required
                                value={formData.userEmail}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('userEmail')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full px-4 pt-6 pb-2 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all duration-300 text-gray-800 font-medium shadow-sm hover:shadow-md hover:border-gray-300"
                            />
                            <div className="absolute right-4 top-4 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="relative">
                            <label
                                className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'userPhone' || formData.userPhone
                                        ? 'top-1 text-xs text-violet-600 font-semibold'
                                        : 'top-4 text-sm text-gray-500'
                                    }`}
                            >
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="userPhone"
                                required
                                value={formData.userPhone}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('userPhone')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full px-4 pt-6 pb-2 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all duration-300 text-gray-800 font-medium shadow-sm hover:shadow-md hover:border-gray-300"
                            />
                            <div className="absolute right-4 top-4 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>

                        {/* Event Date */}
                        <div className="relative">
                            <label
                                className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'eventDate' || formData.eventDate
                                        ? 'top-1 text-xs text-violet-600 font-semibold'
                                        : 'top-4 text-sm text-gray-500'
                                    }`}
                            >
                                Event Date
                            </label>
                            <input
                                type="date"
                                name="eventDate"
                                required
                                value={formData.eventDate}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('eventDate')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full px-4 pt-6 pb-2 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all duration-300 text-gray-800 font-medium shadow-sm hover:shadow-md hover:border-gray-300"
                            />
                        </div>

                        {/* Notes */}
                        <div className="relative">
                            <label
                                className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'notes' || formData.notes
                                        ? 'top-1 text-xs text-violet-600 font-semibold'
                                        : 'top-4 text-sm text-gray-500'
                                    }`}
                            >
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('notes')}
                                onBlur={() => setFocusedField(null)}
                                rows="3"
                                className="w-full px-4 pt-8 pb-2 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all duration-300 resize-none text-gray-800 font-medium shadow-sm hover:shadow-md hover:border-gray-300"
                            ></textarea>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full relative overflow-hidden bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold py-4 rounded-2xl transition-all duration-500 shadow-xl shadow-violet-500/50 hover:shadow-2xl hover:shadow-violet-600/60 hover:scale-[1.02] active:scale-[0.98] group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Confirm Booking
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </button>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-6 pt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Secure Booking</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span className="font-medium">Instant Confirmation</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { transform: translateX(0%) translateY(0%); }
                    50% { transform: translateX(5%) translateY(5%); }
                }
                
                .animate-gradient {
                    animation: gradient 15s ease infinite;
                }

                .booking-form-overlay {
                    animation: fadeIn 0.3s ease-out;
                }

                .booking-form-card {
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default BookingForm;
