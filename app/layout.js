import './globals.css';
import { Inter } from 'next/font/google';
import I18nProvider from '../lib/I18nProvider';
import Header from "@/components/Header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

// Մետա տվյալներ Open Graph-ով
export const metadata = {
    title: 'MovieNest', // Ձեր կայքի վերնագիրը
    description: 'Ձեր կինոյի աշխարհը - ֆիլմեր, սերիալներ և ավելին', // Ձեր կայքի նկարագրությունը
    openGraph: {
        title: 'MovieNest',
        description: 'Ձեր կինոյի աշխարհը - ֆիլմեր, սերիալներ և ավելին',
        url: 'https://movienest.live', // Ձեր կայքի URL-ը
        siteName: 'MovieNest',
        images: [
            {
                url: 'https://thumb.cloud.mail.ru/thumb/xw1/ChatGPT%20Image%205%20%D0%B0%D0%BF%D1%80.%202025%20%D0%B3.%2C%2001_02_17.png', // Ձեր պատկերի URL-ը
                width: 1200, // Լայնությունը պիքսելներով
                height: 630, // Բարձրությունը պիքսելներով
                alt: 'MovieNest - Ձեր կինոյի աշխարհը',
            },
        ],
        locale: 'hy_AM', // Լեզուն (Հայերենի համար)
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
        <body className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-500 ${inter.className}`}>
        <I18nProvider>
            <Header />
            {children}
            <Analytics />
            <SpeedInsights />
        </I18nProvider>
        </body>
        </html>
    );
}