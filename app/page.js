'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

export default function Home() {
    const router = useRouter();
    const { t } = useTranslation();
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

    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex flex-col">
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                        {t('welcome')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-center">{t('thisIsYourHome')}</p>
                </div>
            </div>
        </div>
    );
}
