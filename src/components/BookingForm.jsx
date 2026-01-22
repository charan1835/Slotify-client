import React, { useState } from "react";

const BookingForm = ({ isOpen, onClose, onSubmit, vendorName, initialData }) => {
    const [formData, setFormData] = useState({
        userName: initialData?.name || "",
        userEmail: initialData?.email || "",
        userPhone: initialData?.phone || "",
        eventDate: "",
        notes: "",
    });

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-1">Book Service</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Booking <span className="font-semibold text-black">{vendorName}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="userName"
                            required
                            value={formData.userName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="userEmail"
                            required
                            value={formData.userEmail}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="userPhone"
                            required
                            value={formData.userPhone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                            placeholder="+1 234 567 8900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Date
                        </label>
                        <input
                            type="date"
                            name="eventDate"
                            required
                            value={formData.eventDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition resize-none"
                            placeholder="Any special requests..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-medium py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-gray-200 mt-2"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
