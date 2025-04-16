import './globals.css';
import { Inter } from 'next/font/google';
import I18nProvider from '../lib/I18nProvider';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

// Մետա տվյալներ Open Graph-ով
export const metadata = {
    title: 'MovieNest | Ֆիլմեր և սերիալներ առցանց հայերենով',
    description: 'Դիտեք նորագույն ֆիլմեր և սերիալներ անվճար, առանց գրանցման, հայերեն թարգմանությամբ կամ ենթագրերով։ MovieNest.live — Ձեր կինոյի աշխարհը։',
    keywords: [
        'ֆիլմեր', 'սերիալներ', 'դիտել ֆիլմ', 'հայերեն ֆիլմեր', 'ֆիլմեր առցանց',
        'անվճար ֆիլմեր', 'նոր ֆիլմեր', 'հայերեն սուբտիտրներ', 'սերիալներ հայերենով',
        'movies', 'watch movies online', 'free movies', 'armenian movies', 'armenian series',
        'watch series online', 'latest movies', 'armenian subtitles', 'MovieNest',
        'фильмы', 'смотреть фильмы онлайн', 'бесплатные фильмы', 'армянские фильмы',
        'армянские сериалы', 'фильмы с субтитрами', 'новые фильмы', 'MovieNest','filmer','film','kino','kinoner','ditel','online'
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
        title: 'MovieNest | Armenian Movies & Series Online | Фильмы и сериалы на армянском',
        description: 'Watch the latest movies and series online in Armenian. Бесплатно смотрите фильмы и сериалы на армянском языке на сайте MovieNest.live.',
        images: [
            'https://thumb.cloud.mail.ru/weblink/thumb/xw1/EnV1/gBfsMpWr2'
        ],
    },
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1',
    charset: 'utf-8',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
        <head>
            <link rel="manifest" href="/manifest.json"/>
        </head>
        <body className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-500 ${inter.className}`}>
        <I18nProvider>
            {/*<Header />*/}
            {children}
            <Analytics/>
            <SpeedInsights/>
        </I18nProvider>
        </body>
        </html>
    );
}
