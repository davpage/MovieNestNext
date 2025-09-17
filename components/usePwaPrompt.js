import { useEffect, useState } from 'react';

export default function usePwaPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            localStorage.setItem('showPwaPrompt', 'true');
            setIsReady(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            // console.log('User accepted the PWA install');
        }
        localStorage.setItem('showPwaPrompt', 'false');
    };

    return { isReady, promptInstall };
}

