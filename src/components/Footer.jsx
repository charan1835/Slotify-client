import React from 'react';
const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white mt-auto pt-16 pb-8 rounded-t-3xl mx-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-black mb-4">Slotify<span className="text-yellow-500">.</span></h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Connecting you with premium event professionals for weddings, parties, and corporate events.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Discover</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition">Venues</a></li>
                            <li><a href="#" className="hover:text-white transition">Photographers</a></li>
                            <li><a href="#" className="hover:text-white transition">Makeup Artists</a></li>
                            <li><a href="#" className="hover:text-white transition">Caterers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition">Press</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Cancellation Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Slotify Inc. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition">Twitter</a>
                        <a href="#" className="hover:text-white transition">Instagram</a>
                        <a href="#" className="hover:text-white transition">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
