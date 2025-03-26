'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

export default function User() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [editing, setEditing] = useState(false);
    const [darkMode, setDarkMode] = useState(null); // Initially null to avoid hydration mismatch
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            fetchUser(token);
        }

        // Initialize dark mode on client-side
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [router]);

    const fetchUser = async (token) => {
        try {
            const decoded = jwtDecode(token);
            const response = await fetch(`/api/users/${decoded.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(t('fetchUserFailed'));
            const data = await response.json();
            setUser(data);
            setName(data.name); // Սկզբնական անունը սահմանվում է այստեղ
        } catch (error) {
            console.error('Error fetching user:', error);
            router.push('/login');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const decoded = jwtDecode(token);
            const response = await fetch(`/api/users/${decoded.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, password: password || undefined }),
            });
            if (response.ok) {
                const { user: updatedUser, token: newToken } = await response.json(); // Ստանում ենք user-ը և token-ը
                setUser(updatedUser); // Թարմացնում ենք user state-ը
                setName(updatedUser.name); // Թարմացնում ենք name state-ը
                if (newToken) localStorage.setItem('token', newToken); // Թարմացնում ենք token-ը, եթե այն վերադարձվել է
                setEditing(false); // Դուրս ենք գալիս խմբագրումից
                setPassword(''); // Մաքրում ենք գաղտնաբառը
            } else {
                throw new Error(t('updateFailed'));
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm(t('confirmDelete'))) return;
        const token = localStorage.getItem('token');
        try {
            const decoded = jwtDecode(token);
            const response = await fetch(`/api/users/${decoded.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                throw new Error(t('deleteFailed'));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Wait for darkMode and user to initialize to avoid hydration mismatch
    if (darkMode === null || !user) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                {t('loading')}
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    {t('myData')}
                </h1>

                {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('name')}
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('newPasswordOptional')}
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                                />
                            </label>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            >
                                {t('update')}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setName(user.name); // Վերականգնել սկզբնական անունը
                                    setPassword(''); // Մաքրել գաղտնաբառը
                                }}
                                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 dark:hover:bg-gray-400"
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>{t('name')}:</strong> {user.name}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>{t('email')}:</strong> {user.email}
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setEditing(true)}
                                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-400"
                            >
                                {t('edit')}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 dark:hover:bg-red-400"
                            >
                                {t('deleteAccount')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
