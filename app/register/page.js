'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const [step, setStep] = useState('register');

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setUserId(data.userId);
                setStep('verify');
            } else {
                setError(data.error || t('registerFailed'));
            }
        } catch (error) {
            setError(t('somethingWentWrong'));
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, code }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                setError(data.error || t('verificationFailed'));
            }
        } catch (error) {
            setError(t('somethingWentWrong'));
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex flex-col">
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                        {step === 'register' ? t('register') : t('verify')}
                    </h1>

                    {step === 'register' ? (
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('name')}
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('email')}
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('password')}
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
                                    />
                                </label>
                            </div>
                            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                {t('registerButton')}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('verificationCode')}
                                    <input
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
                                    />
                                </label>
                            </div>
                            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                {t('verifyButton')}
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
                        {t('alreadyRegistered')}{' '}
                        <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            {t('loginButton')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
