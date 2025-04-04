'use client';

import {useTranslation} from 'react-i18next';
import Header from '@/components/Header';

export default function Product() {
    const {t} = useTranslation();

    // Օրինակ ապրանքներ
    const products = [
        {id: 1, name: t('phone'), price: 299},
        {id: 2, name: t('shirt'), price: 49},
        {id: 3, name: t('book'), price: 19},
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
            <main className="container mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('product')}
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {t('product_intro')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                                {product.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('price')}: ${product.price}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}