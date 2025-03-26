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
                url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWUlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww', // Ձեր պատկերի URL-ը
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