import React from 'react';

const AboutPage = () => {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-24 px-4 text-center">
                <h1 className="text-5xl font-black mb-6">About Slotify</h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    We're on a mission to simplify event planning by connecting you with the best professionals in the industry.
                </p>
            </div>

            {/* Story Section */}
            <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Our Story</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            Started in 2024, Slotify was born out of the frustration of endless phone calls and confusing spreadsheets. We realized that booking a wedding photographer or a corporate venue should be as easy as booking a hotel room.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Today, we help thousands of people plan their dream events with confidence, offering verified vendors, transparent pricing, and instant booking capabilities.
                        </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 h-64 rounded-2xl flex items-center justify-center text-4xl">
                        🚀
                    </div>
                </section>

                <section className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800">
                        <div className="text-4xl mb-4">💎</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Premium Quality</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">We hand-pick every vendor to ensure high standards.</p>
                    </div>
                    <div className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800">
                        <div className="text-4xl mb-4">🛡️</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Secure Payments</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your money is safe with our escrow-style booking system.</p>
                    </div>
                    <div className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">24/7 Support</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Our team is always here to help you plan perfectly.</p>
                    </div>
                </section>

                <section className="bg-slate-50 dark:bg-gray-800 p-8 rounded-3xl text-center">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Ready to plan your event?</h2>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">Join thousands of happy customers.</p>
                    <a href="/events" className="inline-block bg-black dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition">
                        Browse Vendors
                    </a>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
