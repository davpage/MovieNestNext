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

    const isAuthPage = pathname === '/login' || pathname === '/register';

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        document.documentElement.classList.toggle('dark', savedDarkMode);

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

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const changeLanguage = (lng) => i18n.changeLanguage(lng);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem('darkMode', newMode);
            document.documentElement.classList.toggle('dark', newMode);
            return newMode;
        });
    };

    if (darkMode === null) return null;

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between bg-white dark:bg-gray-900 px-6 py-4 shadow-lg transition-all duration-300">
            {/* Logo or Home Link */}
            {!isAuthPage && (
                <Link
                    href="/"
                    className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                    {t('home')}
                </Link>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-6">
                {/* Language Buttons */}
                <div className="flex space-x-2">
                    {['en', 'ru', 'am'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => changeLanguage(lang)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                i18n.language === lang
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600'
                            }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-500 dark:hover:bg-indigo-600 hover:text-white transition-all duration-200"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>

                {/* User Dropdown */}
                {!isAuthPage && (
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors duration-200"
                        >
                            <span>{userName || t('user')}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 animate-fade-in">
                                <Link
                                    href="/user"
                                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors duration-200"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    {t('personalData')}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
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
