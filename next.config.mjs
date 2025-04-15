/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'kinogo.ec',
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
