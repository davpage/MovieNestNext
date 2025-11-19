'use client'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

const langs = ['en', 'ru', 'am']

export default function LocaleSwitcher() {
    const { i18n } = useTranslation()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    const current = (i18n.resolvedLanguage || i18n.language || 'am').toLowerCase()
    const index = langs.findIndex(lng => current.startsWith(lng))
    const finalIndex = index === -1 ? 0 : index

    const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng)
        document.documentElement.lang = lng
        try { localStorage.setItem('i18nextLng', lng) } catch {}
    }

    return (
        <div
            className="relative inline-flex items-center rounded-full
                       bg-zinc-200/60 dark:bg-zinc-700/60
                       border border-zinc-300/60 dark:border-zinc-600/60
                       hover:shadow-soft transition-all select-none"
            style={{ width: 125, height: 38 }}
        >
            {/* gradient halo */}
            <span className="absolute inset-0 -z-10 rounded-full"
                  style={{
                      padding: 2,
                      background: 'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))'
                  }} />

            {/* glass */}
            <span className="absolute inset-[2px] rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-sm" />

            {/* PERFECTLY CENTERED THUMB */}
            <span
                className="absolute top-1/2 left-[4px] h-7 w-[36px]
                           rounded-full shadow-glass
                           bg-gradient-to-br from-brand-500 to-accent-500
                           dark:from-accent-400 dark:to-flame-400
                           transition-all duration-300"
                style={{
                    transform: `translate(${finalIndex * 40}px, -50%)`
                }}
            />

            {/* labels */}
            <div className="relative z-10 flex w-full justify-between px-1 text-xs font-semibold">
                {langs.map((lng) => {
                    const active = current.startsWith(lng)
                    return (
                        <button
                            key={lng}
                            onClick={() => changeLanguage(lng)}
                            className={`
                                w-[36px] h-[30px] flex items-center justify-center
                                rounded-full transition-all
                                ${active ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}
                            `}
                        >
                            {lng.toUpperCase()}
                        </button>
                    )
                })}
            </div>

            {/* pulse ring */}
            <span
                className="absolute inset-0 rounded-full pointer-events-none
                           ring-2 ring-brand-500/20 dark:ring-accent-400/25 animate-pulse-slow"
                style={{ clipPath: 'inset(2px round 999px)' }}
            />
        </div>
    )
}
