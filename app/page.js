'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import {useTranslation} from 'react-i18next';

export default function Home() {
    const router = useRouter();
    const {t} = useTranslation();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            router.push('/login');
        } else {
            try {
                const decoded = jwtDecode(token);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Invalid token:', error);
                setIsAuthenticated(false);
                router.push('/login');
            }
        }
    }, [router]);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                {t('loading')}
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
        <main className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('home')}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                {t('welcome_message')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                        {t('explore_categories')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('explore_categories_desc')}
                    </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                        {t('view_products')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('view_products_desc')}
                    </p>
                </div>
            </div>
        </main>
    </div>

}
