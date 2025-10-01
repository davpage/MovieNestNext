'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

/** safely coerce t(...) result to array */
const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : [])

export default function AboutContent() {
    const { t } = useTranslation()

    // make sure these are arrays even if i18n returns string/undefined
    const features = asArray(t('about.features', { returnObjects: true }))
    const values   = asArray(t('about.values',   { returnObjects: true }))
    const faqs     = asArray(t('about.faqs',     { returnObjects: true }))

    const faqJsonLd =
        faqs.length > 0
            ? {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
            }
            : null

    return (
        <>
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}

            {/* Hero */}
            <section className="relative">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_400px_at_20%_0%,rgba(244,63,94,0.22),transparent_60%),radial-gradient(600px_400px_at_80%_0%,rgba(99,102,241,0.22),transparent_60%)]" />
                <div className="mx-auto max-w-6xl px-4 pt-10 pb-8">
                    <div className="flex items-center gap-3">
                        <Image src="/logo/logo-black.svg" alt="MovieNest" width={56} height={40} className="block dark:hidden" priority />
                        <Image src="/logo/logo-white.svg" alt="MovieNest" width={56} height={40} className="hidden dark:block" priority />
                        <h1 className="text-2xl sm:text-3xl font-semibold">{t('about.title')}</h1>
                    </div>

                    <p className="mt-4 max-w-3xl text-zinc-700 dark:text-zinc-300">{t('about.lead')}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                            href="/"
                            className="relative inline-flex items-center justify-center rounded-full
                         bg-zinc-200/60 dark:bg-zinc-700/60
                         border border-zinc-300/60 dark:border-zinc-600/60
                         hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]
                         transition-all px-4 h-10"
                        >
                            <span className="absolute inset-0 -z-10 rounded-full" style={{ padding: 2, background: 'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))' }} />
                            <span className="absolute inset-[2px] rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-sm" />
                            <span className="relative z-10">{t('about.cta_start')}</span>
                            <span className="absolute inset-0 rounded-full pointer-events-none ring-2 ring-indigo-500/20 dark:ring-cyan-300/25 animate-pulse" style={{ clipPath: 'inset(2px round 999px)' }} />
                        </Link>

                        <Link
                            href="#faq"
                            className="relative inline-flex items-center justify-center rounded-full
                         bg-zinc-200/40 dark:bg-zinc-800/50
                         border border-zinc-300/40 dark:border-zinc-700/50
                         hover:bg-zinc-200/60 dark:hover:bg-zinc-800/70
                         transition-all px-4 h-10 text-sm"
                        >
                            {t('about.cta_more')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            {features.length > 0 && (
                <section className="mx-auto max-w-6xl px-4 py-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((f, i) => (
                            <div key={i} className="relative rounded-2xl p-4 bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-white/10 hover:-translate-y-[2px] transition">
                                <span className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 hover:opacity-100" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.28), rgba(34,211,238,.28))' }} />
                                <h3 className="text-base font-semibold">{f.title}</h3>
                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Values */}
            {values.length > 0 && (
                <section className="mx-auto max-w-6xl px-4 py-6">
                    <div className="rounded-2xl p-6 bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-white/10">
                        <h2 className="text-lg sm:text-xl font-semibold">{t('about.values_title')}</h2>
                        <div className="mt-4 grid sm:grid-cols-3 gap-4">
                            {values.map((v, i) => (
                                <div key={i} className="rounded-xl p-4 border border-white/10 bg-white/40 dark:bg-black/25">
                                    <h3 className="font-semibold">{v.title}</h3>
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ */}
            {faqs.length > 0 && (
                <section id="faq" className="mx-auto max-w-6xl px-4 py-8">
                    <div className="rounded-2xl p-6 bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-white/10">
                        <h2 className="text-lg sm:text-xl font-semibold">{t('about.faq_title')}</h2>
                        <div className="mt-4 divide-y divide-white/10">
                            {faqs.map((f, i) => (
                                <details key={i} className="group py-3">
                                    <summary className="flex items-center justify-between cursor-pointer list-none">
                                        <span className="font-medium">{f.q}</span>
                                        <span className="ml-4 text-zinc-500 group-open:rotate-45 transition">＋</span>
                                    </summary>
                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
