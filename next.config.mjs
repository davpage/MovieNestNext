/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://api.movienest.live:99/:path*', // backend proxy
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'kinogo.online',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.kinopoisk.ru',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'thumb.cloud.mail.ru',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
