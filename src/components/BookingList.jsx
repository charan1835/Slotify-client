import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchVendorBookings,
  changeBookingStatus,
} from "../redux/bookingSlice";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const BookingList = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(fetchVendorBookings());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(changeBookingStatus({ id, statusData: { status } }));
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load bookings.
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-gray-400 text-sm italic">
        No bookings yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Bookings</h2>

      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="border rounded-xl p-4 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          {/* Booking Info */}
          <div className="space-y-1">
            <p className="font-medium text-gray-800">
              {booking.vendorName}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(booking.date).toLocaleDateString()}
            </p>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                statusStyles[booking.status] ||
                "bg-gray-100 text-gray-600"
              }`}
            >
              {booking.status}
            </span>
          </div>

          {/* Actions */}
          {booking.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleStatusChange(booking._id, "confirmed")
                }
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:opacity-90 transition"
              >
                Confirm
              </button>

              <button
                onClick={() =>
                  handleStatusChange(booking._id, "cancelled")
                }
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:opacity-90 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingList;
