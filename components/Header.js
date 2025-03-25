'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { t, i18n } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(null);
    const [userName, setUserName] = useState('');

    // Check if current page is an auth page
    const isAuthPage = pathname === '/login' || pathname === '/register';

    useEffect(() => {
        // Initialize dark mode
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Set userName only if not on auth pages
        if (!isAuthPage) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUserName(decoded.name || t('user'));
                } catch (error) {
                    console.error('Invalid token:', error);
                }
            }
        }
    }, [t, isAuthPage]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.relative')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const handleLogout = () => {
        setDropdownOpen(false);
        localStorage.removeItem('token');
        router.push('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
            return newMode;
        });
    };

    if (darkMode === null) {
        return null; // Avoid rendering until dark mode is initialized
    }




    return (
        <nav className="flex items-center bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg">
            {!isAuthPage && (
                    <Link
                        href="/"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                    >
                        {t('home')}
                    </Link>

            )}
            <div className="flex items-center space-x-4 ml-auto">
                {/* Language Selection */}
                <select
                    onChange={(e) => changeLanguage(e.target.value)}
                    value={i18n.language}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-none rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                >
                    <option value="en">EN</option>
                    <option value="ru">RU</option>
                    <option value="am">AM</option>
                </select>

                {/* Dark/Light Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>

                {/* User Dropdown (only on non-auth pages) */}
                {!isAuthPage && (
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center focus:outline-none transition-colors duration-200"
                        >
                            {userName || t('user')}
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                                <Link
                                    href="/user"
                                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    {t('personalData')}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                >
                                    {t('logout')}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
