'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function ResetPassword() {
    const { t } = useTranslation();
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [email, setEmail] = useState(''); // Եթե email-ը չի փոխանցվում URL-ով
    const [userId, setUserId] = useState(null); // Եթե userId-ն չի փոխանցվում URL-ով
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Նոր state loading-ի համար

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Սկսել loading-ը
        setError(''); // Մաքրել նախորդ սխալը
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, code, newPassword, email }), // Email-ը ավելացվել է, եթե backend-ը պահանջում է
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess(true);
                setError('');
            } else {
                setError(data.error || t('resetFailed'));
            }
        } catch (error) {
            setError(t('somethingWentWrong'));
        } finally {
            setIsLoading(false); // Ավարտել loading-ը
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex flex-col h-[calc(100vh_-_75px)]">
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                        {t('resetPassword')}
                    </h1>

                    {success ? (
                        <div className="text-center">
                            <p className="text-green-500 dark:text-green-400 text-lg mb-4">
                                {t('passwordResetSuccess')}
                            </p>
                            <Link
                                href="/login"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                {t('backToLogin')}
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
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
                                    {t('resetCode')}
                                    <input
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('newPassword')}
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
                                    />
                                </label>
                            </div>
                            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2 px-4 rounded-md text-white transition-colors duration-200 ${
                                    isLoading
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        {t('loading')}
                                    </span>
                                ) : (
                                    t('resetPasswordButton')
                                )}
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
                        <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            {t('backToLogin')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
