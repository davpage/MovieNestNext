/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'kinogo.online', pathname: '/**' },
            { protocol: 'https', hostname: 'www.kinopoisk.ru', pathname: '/**' },
            { protocol: 'https', hostname: 'thumb.cloud.mail.ru', pathname: '/**' }
        ]
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Permissions-Policy', value: 'autoplay=(self), geolocation=()' },
                    { key: 'Cache-Control', value: 'public, max-age=60, s-maxage=600, stale-while-revalidate=86400' }
                ]
            }
        ]
    }
}
module.exports = nextConfig
