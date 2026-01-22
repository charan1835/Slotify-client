import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000",
});

API.interceptors.request.use((req) => {
    const profile = localStorage.getItem("profile");
    if (profile) {
        req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
    }
    return req;
});

/* AUTH */
export const sendOtp = (data) => API.post("/auth/send-otp", data);
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);
export const updateUserProfile = (data) => API.put("/auth/profile", data);

/* BOOKINGS */
export const createBooking = (bookingData) =>
    API.post("/bookings", bookingData);

export const getUserBookings = () =>
    API.get("/bookings/my-bookings");

export const getVendorBookings = (vendorId) =>
    API.get("/bookings", { params: { vendorId } });

export const updateBookingStatus = (id, statusData) =>
    API.patch(`/bookings/${id}`, statusData);

/* CATEGORIES */
export const getCategories = () =>
    API.get("/categories");

/* VENDORS */
export const getVendorsByCategory = (categoryId) =>
    API.get("/vendors", { params: { categoryId } });

export const getVendorById = (id) =>
    API.get(`/vendors/${id}`);
