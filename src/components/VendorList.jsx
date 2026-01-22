import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // only for auth
import axios from "axios";

const API = axios.create({
  baseURL: "https://slotify-server.vercel.app",
});

// Add authorization token to requests
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("profile");
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
});

const VendorList = ({ categoryId }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        // If categoryId is passed, filter by it. Otherwise get all (assuming backend supports it or we adjust endpoint)
        // Note: Backend /vendors currently requires categoryId in the controller validation.
        // We will need to update the backend or just loop through sample categories if we want "All" without backend change.
        // For now, let's assume we stick to category selection in the main flow, OR we fix the backend.
        // Let's FIX THE BACKEND to allow optional categoryId for "All Vendors".

        const params = categoryId ? { categoryId } : {};
        const { data } = await API.get("/vendors", { params });
        setVendors(data);
      } catch (err) {
        console.error("Fetch error", err);
        setError("Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [categoryId]);

  // Fallback vendors mapped by Category ID (Simplified for demo if fetch fails)
  // ... (keeping sample data logic if needed, but the seed script should have fixed this)

  const handleBookClick = (vendorId) => {
    navigate(`/book/${vendorId}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  if (error && vendors.length === 0) {
    // If backend fail, show empty state or error
    return <div className="text-red-500 text-sm hidden">{error}</div>;
  }

  // Display all provided vendors
  return (
    <div className="space-y-6">
      {!categoryId && <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Vendors</h3>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div
            key={vendor._id}
            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Image Placeholder or Actual Image */}
            <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

              <div className="absolute bottom-4 left-4 z-20 text-white">
                <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium border border-white/30">
                  {vendor.rating || 4.5} ★
                </span>
              </div>

              <img
                src={vendor.image && !vendor.image.startsWith('http') ? `https://source.unsplash.com/random/800x600/?event,${vendor.categoryId?.name || 'wedding'}` : (vendor.image || `https://images.unsplash.com/photo-${['1519741497674-611481863552', '1511795409834-ef04bbd61622', '1469334031218-e382a71b716b', '1530103862676-de3c9772a868'][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&w=800&q=80`)}
                alt={vendor.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80'; }}
              />
            </div>

            <div className="p-5">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{vendor.name}</h4>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                <span>{vendor.email || "Contact for details"}</span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold tracking-wider">Starting at</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">₹{vendor.price}</p>
                </div>
                <button
                  onClick={() => handleBookClick(vendor._id)}
                  className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-lg shadow-gray-200 dark:shadow-none"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vendors.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No vendors found.
        </div>
      )}
    </div>
  );
};

export default VendorList;