import './globals.css';
import ClientLayout from './ClientLayout'; // Import the new client component

export const metadata = {
    title: 'My App',
    description: 'A simple app with Next.js 15',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
        <body className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <ClientLayout>{children}</ClientLayout>
        </body>
        </html>
    );
}
