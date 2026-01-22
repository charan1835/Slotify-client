import React, { useState } from 'react';
import VendorList from '../components/VendorList';

const EventsPage = () => {
    return (
        <div className="space-y-12 pb-16">
            {/* Hero & Search Section */}
            <section className="bg-slate-900 text-white py-20 px-4 rounded-b-3xl mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="relative max-w-4xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Find the Perfect<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Event Professionals</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Search through hundreds of top-rated venues, photographers, and caterers.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-2xl max-w-2xl mx-auto flex items-center transition-colors duration-300">
                        <span className="pl-4 text-2xl">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by vendor name, service, or location..."
                            className="flex-grow px-4 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none rounded-full"
                        />
                        <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Moving Top Places (Marquee) */}
            <section className="overflow-hidden bg-white dark:bg-slate-900 py-8 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Trending Locations</h2>
                </div>

                {/* CSS Animation Wrapper */}
                <div className="relative flex overflow-x-hidden group">
                    <div className="py-2 animate-marquee whitespace-nowrap flex gap-8 px-4">
                        {[
                            { name: "The Grand Ballroom, Mumbai", img: "🏰" },
                            { name: "Sunset Beach Resort, Goa", img: "🏖️" },
                            { name: "Royal Palace, Jaipur", img: "🕌" },
                            { name: "Cloud 9 Convention, Bangalore", img: "🌆" },
                            { name: "Lakeside Manor, Udaipur", img: "⛵" },
                            { name: "Heritage Fort, Delhi", img: "🏯" },
                            { name: "Orchid Gardens, Pune", img: "🌺" },
                        ].map((place, index) => (
                            <div key={index} className="inline-flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-full shadow-sm">
                                <span className="text-2xl">{place.img}</span>
                                <span className="font-bold text-slate-800 dark:text-gray-200">{place.name}</span>
                            </div>
                        ))}
                        {/* Duplicate for seamless scrolling */}
                        {[
                            { name: "The Grand Ballroom, Mumbai", img: "🏰" },
                            { name: "Sunset Beach Resort, Goa", img: "🏖️" },
                            { name: "Royal Palace, Jaipur", img: "🕌" },
                            { name: "Cloud 9 Convention, Bangalore", img: "🌆" },
                            { name: "Lakeside Manor, Udaipur", img: "⛵" },
                            { name: "Heritage Fort, Delhi", img: "🏯" },
                            { name: "Orchid Gardens, Pune", img: "🌺" },
                        ].map((place, index) => (
                            <div key={`dup-${index}`} className="inline-flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-full shadow-sm">
                                <span className="text-2xl">{place.img}</span>
                                <span className="font-bold text-slate-800 dark:text-gray-200">{place.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inline Style for Marquee Animation */}
                <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 30s linear infinite;
                    }
                `}</style>
            </section>

            {/* All Vendors List */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">All Event Vendors</h2>
                    <div className="flex gap-2">
                        <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none">
                            <option>Sort by Recommended</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Rating</option>
                        </select>
                    </div>
                </div>

                {/* Pass null to get ALL vendors */}
                <VendorList categoryId={null} />
            </section>
        </div>
    );
};

export default EventsPage;
