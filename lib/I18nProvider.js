// app/components/I18nProvider.js
'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n'; // Ճշգրիտ ուղին կախված է Ձեր կառուցվածքից

export default function I18nProvider({ children }) {
    useEffect(() => {
        // i18n-ն արդեն ինիցիալիզացված է /lib/i18n.js-ում
    }, []);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
