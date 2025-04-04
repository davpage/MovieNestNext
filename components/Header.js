'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import {useTranslation} from 'react-i18next';
import {HiMenu} from 'react-icons/hi';
import Logo from '@/components/Logo';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const {t, i18n} = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(null);
    const [userName, setUserName] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-btn')) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen, sidebarOpen]);

    const handleLogout = () => {
        setDropdownOpen(false);
        localStorage.removeItem('token');
        router.push('/login');
    };

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
        <>
            <nav
                className="sticky h-[80px] top-0 z-50 flex items-center justify-between bg-white dark:bg-gray-900 px-6 shadow-lg transition-all duration-300">

                {!isAuthPage && (
                    <Link
                        href="/"
                        className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                    >
                        <Logo w={"60"} h={"60"} className="text-indigo-600 dark:text-white"/>
                    </Link>
                )}

                <div className="flex items-center space-x-6">
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

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-500 dark:hover:bg-indigo-600 hover:text-white transition-all duration-200"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    {!isAuthPage && <HiMenu
                        className="text-indigo-600 text-[30px] cursor-pointer menu-btn"
                        onClick={toggleSidebar}
                    />}

                    {!isAuthPage && (
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center w-[50px] h-[50px] rounded-full space-x-1 bg-indigo-600 dark:bg-indigo-400 justify-center text-[30px] hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors duration-200"
                            >
                                <span>{(userName || t('user')).charAt(0).toUpperCase()}</span>
                            </button>
                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 animate-fade-in">
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

            {/* Սայդբար */}
            <div
                className={`sidebar fixed top-[80px] right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                } z-50`}
            >
                <div className="p-4">
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">{t('menu')}</h2>
                    <ul className="space-y-4">
                        <li>
                            <Link
                                href="/"
                                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                                onClick={() => setSidebarOpen(false)}
                            >
                                {t('home')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/category"
                                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                                onClick={() => setSidebarOpen(false)}
                            >
                                {t('category')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/product"
                                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                                onClick={() => setSidebarOpen(false)}
                            >
                                {t('product')}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}