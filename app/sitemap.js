// app/sitemap.js
export default function sitemap() {
    const base = 'https://movienest.cc'
    return ['', '/en', '/ru', '/am', '/about'].map((p) => ({
        url: `${base}${p}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: p === '' ? 1 : 0.7,
    }))
}
