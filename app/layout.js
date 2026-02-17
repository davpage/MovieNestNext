// app/layout.js
import './globals.css'
import {Inter} from 'next/font/google'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {Analytics} from '@vercel/analytics/react'
import {ThemeProvider} from 'next-themes'
import Script from 'next/script'
import Header from "../components/Header";
import I18nProvider from "../lib/I18nProvider";
import PwaInstallModal from "@/components/PwaInstallModal";

const inter = Inter({subsets: ['latin']})

const site = {
    name: 'MovieNest',
    domain: 'https://movienest.cc',
    locales: ['en', 'ru', 'am'],
    defaultLocale: 'en',
    ogImage: 'https://thumb.cloud.mail.ru/weblink/thumb/xw1/EnV1/gBfsMpWr2',
    twitter: '@movienest'
}

export const metadata = {
    metadataBase: new URL(site.domain),
    title: {
        default: 'MovieNest | Ֆիլմեր և սերիալներ',
        template: '%s | MovieNest'
    },
    description:
        'Դիտեք կամ բեռնեք նորագույն ֆիլմեր և սերիալներ անվճար, առանց գրանցման։ movienest.cc — Ձեր կինոյի աշխարհը։',
    alternates: {
        canonical: '/',
        languages: {
            'en-US': '/en',
            'ru-RU': '/ru',
            'hy-AM': '/am'
        }
    },
    openGraph: {
        type: 'website',
        locale: 'hy_AM',
        url: site.domain,
        siteName: 'MovieNest',
        title: 'MovieNest | Ֆիլմեր և սերիալներ առցանց հայերենով',
        description:
            'Դիտեք նոր ֆիլմեր և սերիալներ movienest.cc կայքում։ Առանց գովազդի, առանց գրանցման։',
        images: [{url: site.ogImage, width: 1200, height: 630, alt: 'MovieNest'}]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MovieNest | Movies & Series | Фильмы и сериалы',
        description:
            'Watch or download the latest movies and series online. Бесплатно смотрите фильмы и сериалы на movienest.cc.',
        images: [site.ogImage],
        site: site.twitter
    },
    robots: {index: true, follow: true},
    manifest: '/manifest.json',
    other: {charset: 'utf-8'},
    keywords: [
        'ֆիլմեր', 'սերիալներ', 'դիտել ֆիլմ', 'ֆիլմեր առցանց', 'անվճար ֆիլմեր', 'նոր ֆիլմեր',
        'movies', 'watch movies online', 'free movies', 'watch series online', 'latest movies', 'MovieNest',
        'фильмы', 'смотреть фильмы онлайн', 'бесплатные фильмы', 'фильмы с субтитрами', 'новые фильмы', 'MovieNest',
        'filmer', 'film', 'kino', 'kinoner', 'ditel', 'online'
    ]
}

export default function RootLayout({children}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            {/* Preconnects for faster 3rd-party image/video hosts */}
            <link rel="preconnect" href="https://www.kinopoisk.ru"/>
            <link rel="preconnect" href="https://kinogo.online"/>
            <link rel="preconnect" href="https://thumb.cloud.mail.ru"/>
            {/* PWA iOS */}
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="theme-color" content="#0b1220"/>
        </head>
        <body className={`
    ${inter.className}
    min-h-screen
    bg-gray-50 dark:bg-gray-950
    bg-radial-faint dark:bg-radial-strong
    bg-fixed
`}>
        <I18nProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                {children}
                <Analytics/>
                <SpeedInsights/>
                <PwaInstallModal/>
            </ThemeProvider>
        </I18nProvider>

        {/* JSON-LD: WebSite + SearchAction */}
        <Script id="ld-website" type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: site.name,
                        url: site.domain,
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: `${site.domain}/?q={search_term_string}`,
                            'query-input': 'required name=search_term_string'
                        }
                    })
                }}
        />
        {/* Organization JSON-LD */}
        <Script id="ld-org" type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: site.name,
                        url: site.domain,
                        logo: site.ogImage
                    })
                }}
        />
        </body>
        </html>
    )
}
