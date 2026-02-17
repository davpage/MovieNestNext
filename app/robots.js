// app/robots.js
export default function robots() {
    const base = 'https://movienest.cc'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
        sitemap: `${base}/sitemap.xml`,
        host: base,
    }
}
