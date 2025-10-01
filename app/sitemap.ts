import { MetadataRoute } from 'next'

export default function sitemap(): Promise<MetadataRoute.Sitemap> | MetadataRoute.Sitemap {
    const base = 'https://movienest.live'

    const routes: MetadataRoute.Sitemap = ['', '/en', '/ru', '/am', '/about'].map(
        (p): MetadataRoute.Sitemap[number] => ({
            url: `${base}${p}`,
            lastModified: new Date(),
            changeFrequency: 'hourly',        // ← literal type ok
            priority: p === '' ? 1 : 0.7,
        })
    )

    return routes
}
