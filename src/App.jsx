import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/authSlice';

// Components
import CategoryList from './components/CategoryList';
import VendorList from './components/VendorList';
import Layout from './components/Layout';

// Pages
import MyBookingsPage from './pages/MyBookingsPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import BookingPage from './pages/BookingPage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';

import './App.css';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center -mt-4 mx-4 sm:mx-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-yellow-400 font-bold tracking-wider uppercase text-sm mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">Premium Event Services</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Make Your Event <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">Unforgettable</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Discover and book the best photographers, venues, and caterers for your special day.
          </p>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full max-w-xl mx-auto border border-white/20 flex animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 shadow-2xl">
            <input
              type="text"
              placeholder="Search for vendors or services..."
              className="flex-grow bg-transparent border-none text-white placeholder-gray-300 px-6 py-3 focus:outline-none w-full"
            />
            <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Destinations</h2>
          <p className="text-gray-500 dark:text-gray-400">Find vendors in these trending locations</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Mumbai', 'Delhi', 'Bangalore', 'Goa'].map(city => (
            <div key={city} className="bg-white dark:bg-slate-800 border dark:border-gray-700 hover:border-black dark:hover:border-white transition p-4 rounded-xl text-center font-medium cursor-pointer text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:shadow-md">
              📍 {city}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-slate-800 py-12 rounded-3xl transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">Browse by Category</h2>
        <CategoryList onSelectCategory={setSelectedCategory} />
      </section>

      {/* Main Vendor List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
        {selectedCategory ? (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Selected Category</h2>
              <button onClick={() => setSelectedCategory(null)} className="text-sm underline text-gray-500 hover:text-black">Clear Filter</button>
            </div>
            <VendorList categoryId={selectedCategory} />
          </div>
        ) : (
          <VendorList categoryId={null} />
        )}
      </section>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('profile'));
    if (user) {
      dispatch(setUser(user));
    }
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/book/:vendorId" element={<BookingPage />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;