'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

export default function Home() {
    const router = useRouter();
    const { t } = useTranslation();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            router.push('/login');
        } else {
            try {
                const decoded = jwtDecode(token);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Invalid token:', error);
                setIsAuthenticated(false);
                router.push('/login');
            }
        }
    }, [router]);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                {t('loading')}
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <div>

    </div>
    // <iframe className='w-full h-[calc(100vh_-_75px)]' src="https://movienest.live/"></iframe>
}
