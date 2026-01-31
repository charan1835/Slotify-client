import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { fetchNotifications } from '../redux/notificationSlice';
import NotificationList from './Notifications/NotificationList';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notification);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Add scroll listener
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch notifications if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchNotifications());
        }
    }, [isAuthenticated, dispatch]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const handleLogout = () => {
        dispatch(logout());
        setMobileMenuOpen(false);
        navigate('/');
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className={`text-2xl font-black tracking-tighter transition z-50 ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
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
                                <Link to="/my-bookings" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
                                    My Bookings
                                </Link>
                            )}
                        </div>

                        {/* Desktop Action Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    {/* Notification Bell */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowNotifications(!showNotifications)}
                                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition relative"
                                        >
                                            <span className="text-xl">🔔</span>
                                            {unreadCount > 0 && (
                                                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white dark:border-slate-900">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                        </button>
                                        {showNotifications && (
                                            <NotificationList onClose={() => setShowNotifications(false)} />
                                        )}
                                    </div>

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

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center focus:outline-none"
                            aria-label="Toggle mobile menu"
                        >
                            <span className={`w-6 h-0.5 bg-slate-900 dark:bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-slate-900 dark:bg-white rounded-full transition-all duration-300 my-1 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-slate-900 dark:bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeMobileMenu}
            ></div>

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl z-40 transform transition-transform duration-300 ease-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full pt-20 pb-6 px-6 overflow-y-auto">
                    {/* User Profile Section (Mobile) */}
                    {isAuthenticated && (
                        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <Link
                                to="/profile"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-2xl text-white font-bold shadow-lg">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-2">
                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition font-medium"
                        >
                            <span className="text-xl">🏠</span>
                            Explore
                        </Link>
                        <Link
                            to="/events"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition font-medium"
                        >
                            <span className="text-xl">🎉</span>
                            Events
                        </Link>
                        {isAuthenticated && (
                            <div
                                onClick={() => { setShowNotifications(!showNotifications); closeMobileMenu(); }}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition font-medium cursor-pointer"
                            >
                                <span className="text-xl relative">
                                    🔔
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
                                    )}
                                </span>
                                Notifications
                            </div>
                        )}
                        <Link
                            to="/about"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition font-medium"
                        >
                            <span className="text-xl">ℹ️</span>
                            About
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/my-bookings"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition font-medium"
                            >
                                <span className="text-xl">📋</span>
                                My Bookings
                            </Link>
                        )}
                    </nav>

                    {/* Auth Actions (Mobile) */}
                    <div className="pt-6 space-y-3 border-t border-gray-200 dark:border-gray-700">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                            >
                                <span>🚪</span>
                                Log Out
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/auth"
                                    onClick={closeMobileMenu}
                                    className="block w-full px-6 py-3 text-center bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/auth"
                                    onClick={closeMobileMenu}
                                    className="block w-full px-6 py-3 text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
