'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Logo from '../components/Logo';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-to-b from-gray-100 to-gray-300 h-[calc(100vh_-_80px)] dark:from-gray-800 dark:to-gray-900 flex flex-col">
            <main className="flex-grow flex items-center justify-center px-6 py-8">
                <div className="text-center animate-fade-in">
                    <div className="mb-8 flex justify-center items-center">
                        <Logo w={"300"} h={"210"} className="mx-auto text-indigo-600 dark:text-indigo-400 animate-bounce" />
                    </div>
                    <h1 className="text-8xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4 tracking-wider">
                        404
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-6">
                        {t('page_not_found', { defaultValue: 'Էջը չի գտնվել' })}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                        {t('not_found_message', {
                            defaultValue: 'Կներեք, բայց Ձեր փնտրած էջը գոյություն չունի կամ տեղափոխվել է:',
                        })}
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transform hover:scale-105 transition-all duration-300"
                    >
                        {t('back_to_home', { defaultValue: 'Վերադառնալ Գլխավոր էջ' })}
                    </Link>
                </div>
            </main>
            <footer className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} {t('website_name', { defaultValue: 'MovieNest' })}
            </footer>
        </div>
    );
}