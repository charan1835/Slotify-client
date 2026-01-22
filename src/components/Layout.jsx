import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow w-full">
                {children}
            </main>
            <Footer />
            <ThemeToggle />
        </div>
    );
};

export default Layout;
