'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Ensure this path matches your i18n setup
import Header from '../components/Header';

export default function ClientLayout({ children }) {
    return (
        <I18nextProvider i18n={i18n}>
            <Header />
            <main>
                {children}
            </main>
        </I18nextProvider>
    );
}
