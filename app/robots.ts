// JS variant if you prefer: export default function robots(){...}
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const base = 'https://movienest.live'
    return {
        rules: [{ userAgent: '*', allow: '/' }],
        sitemap: `${base}/sitemap.xml`,
        host: base
    }
}
