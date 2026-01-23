import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    // Add scroll listener
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className={`text-2xl font-black tracking-tighter transition ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                        Slotify
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
                            Explore
                        </Link>
                        <Link to="/events" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
                            Events
                        </Link>
                        <Link to="/about" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
                            About
                        </Link>
                        {isAuthenticated && (
                            <>
                                <Link to="/my-bookings" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
                                    My Bookings
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:opacity-70 transition">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs text-gray-700 dark:text-gray-200">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="hidden lg:block">{user?.name?.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/auth" className="text-sm font-bold text-slate-900 dark:text-white hover:opacity-70 transition">
                                    Log In
                                </Link>
                                <Link to="/auth" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 dark:hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button (Placeholder) */}
                    <div className="md:hidden flex items-center">
                        <button className="text-slate-900 dark:text-white focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
