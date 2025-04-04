'use client';

import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Category() {
    const { t } = useTranslation();

    // Օրինակ կատեգորիաներ
    const categories = [
        { id: 1, name: t('electronics') },
        { id: 2, name: t('clothing') },
        { id: 3, name: t('books') },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
            <main className="container mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('category')}
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {t('category_intro')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.id}`}
                            className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                                {category.name}
                            </h2>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}