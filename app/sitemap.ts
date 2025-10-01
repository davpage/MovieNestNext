// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://movienest.live'

    const routes: MetadataRoute.Sitemap = ['', '/en', '/ru', '/am', '/about'].map(
        (p): MetadataRoute.Sitemap[number] => ({
            url: `${base}${p}`,
            lastModified: new Date(),
            changeFrequency: 'hourly', // literal OK
            priority: p === '' ? 1 : 0.7,
        })
    )

    return routes
}
