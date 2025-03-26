import './globals.css';
import {Inter} from 'next/font/google';
import I18nProvider from '../lib/I18nProvider';
import Header from "@/components/Header"; // Նոր կոմպոնենտ

const inter = Inter({subsets: ['latin']});

export const metadata = {
    title: 'My App',
    description: 'A simple app with Next.js 15',
};

export default function RootLayout({children}) {
    return (
        <html lang="en" className="dark">
        <body className={`min-h-screen bg-gray-100 dark:bg-gray-900  transition-all duration-500 ${inter.className}`}>
        <I18nProvider>
            <Header/>
            {children}
        </I18nProvider>
        </body>
        </html>
    );
}
