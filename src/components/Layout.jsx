import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAdminPage = location.pathname === '/admin';

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 dark:text-gray-100 transition-colors duration-300">
            {!isAdminPage && <Navbar />}
            <main className={`flex-grow w-full ${!isAdminPage ? 'pt-20' : ''}`}>
                {children}
            </main>
            {!isAdminPage && <Footer />}
            <ThemeToggle />
        </div>
    );
};

export default Layout;
