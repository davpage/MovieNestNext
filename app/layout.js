import './globals.css';
import { Inter } from 'next/font/google';
import I18nProvider from '../lib/I18nProvider';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';
import PwaInstallModal from "@/components/PwaInstallModal";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'MovieNest | Ֆիլմեր և սերիալներ',
    description: 'Դիտեք կամ բեռնեք նորագույն ֆիլմեր և սերիալներ անվճար, առանց գրանցման։ MovieNest.live — Ձեր կինոյի աշխարհը։',
    manifest: '/manifest.json',
    keywords: [
        'ֆիլմեր', 'սերիալներ', 'դիտել ֆիլմ', 'ֆիլմեր առցանց',
        'անվճար ֆիլմեր', 'նոր ֆիլմեր',
        'movies', 'watch movies online', 'free movies',
        'watch series online', 'latest movies', 'MovieNest',
        'фильмы', 'смотреть фильмы онлайн', 'бесплатные фильмы', 'фильмы с субтитрами', 'новые фильмы', 'MovieNest','filmer','film','kino','kinoner','ditel','online'
    ],
    authors: [{ name: 'MovieNest', url: 'https://movienest.live' }],
    openGraph: {
        title: 'MovieNest | Ֆիլմեր և սերիալներ առցանց հայերենով',
        description: 'Դիտեք նոր ֆիլմեր և սերիալներ MovieNest.live կայքում։ Առանց գովազդի, առանց գրանցման։',
        url: 'https://movienest.live',
        siteName: 'MovieNest',
        images: [
            {
                url: 'https://thumb.cloud.mail.ru/weblink/thumb/xw1/EnV1/gBfsMpWr2',
                width: 1200,
                height: 630,
                alt: 'MovieNest - Ֆիլմեր և սերիալներ հայերենով',
            },
        ],
        locale: 'hy_AM',
        type: 'website',
        alternateLocales: ['en_US', 'ru_RU'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MovieNest | Movies & Series | Фильмы и сериалы',
        description: 'Watch or download the latest movies and series online. Бесплатно смотрите фильмы и сериалы на сайте MovieNest.live.',
        images: [
            'https://thumb.cloud.mail.ru/weblink/thumb/xw1/EnV1/gBfsMpWr2'
        ],
    },
    robots: 'index, follow',
    charset: 'utf-8',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};
export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
        <body className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-500 ${inter.className}`}>
        <I18nProvider>
            <PwaInstallModal />
            {children}
            <Analytics/>
            <SpeedInsights/>
        </I18nProvider>
        </body>
        </html>
    );
}
