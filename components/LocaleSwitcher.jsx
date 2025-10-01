'use client'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'

const langs = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'am', label: 'AM' },
]

export default function LocaleSwitcher() {
    const { i18n } = useTranslation()

    // ✅ բոլոր hooks-երը անպայման կանչվում են, առանց պայմանական return-ի
    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(false)
    const boxRef = useRef(null)

    useEffect(() => { setMounted(true) }, [])

    // close on outside/Escape (միշտ attach/remove, բայց harmless է մինչև mounted=true)
    useEffect(() => {
        const onDoc = (e) => {
            if (e.key === 'Escape') setOpen(false)
            if (boxRef.current && e.target && !boxRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('click', onDoc)
        document.addEventListener('keydown', onDoc)
        return () => {
            document.removeEventListener('click', onDoc)
            document.removeEventListener('keydown', onDoc)
        }
    }, [])

    const current = (i18n.resolvedLanguage || i18n.language || 'am').toLowerCase()
    const currentLang = langs.find(l => current.startsWith(l.code)) || langs[2]

    const changeLanguage = async (lng) => {
        if (typeof i18n?.changeLanguage === 'function') {
            await i18n.changeLanguage(lng)
            document.documentElement.lang = lng
            try { localStorage.setItem('i18nextLng', lng) } catch {}
            setOpen(false)
        }
    }

    // ✨ UI — desktop: 3-pill, mobile: current-only + dropdown
    return (
        <div className="relative">
            {/* Desktop */}
            <div
                className="hidden sm:inline-flex items-center justify-between rounded-full
                   bg-zinc-200/60 dark:bg-zinc-700/60 border border-zinc-300/60 dark:border-zinc-600/60
                   hover:shadow-soft transition-all w-[120px] h-9 relative"
            >
        <span className="absolute inset-0 -z-10 rounded-full"
              style={{ padding: 2, background: 'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))' }} />
                <span className="absolute inset-[2px] rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-sm" />
                <div className="relative z-10 flex w-full justify-between items-center px-1">
                    {langs.map((l) => {
                        const active = current.startsWith(l.code)
                        return (
                            <button
                                key={l.code}
                                onClick={() => changeLanguage(l.code)}
                                className={`relative flex-1 h-7 mx-[2px] rounded-full text-xs font-semibold transition-all
                           ${active ? 'text-white' : 'text-zinc-700 dark:text-zinc-300 hover:text-white'}`}
                            >
                                {active && (
                                    <span className="absolute inset-0 rounded-full -z-10 transition-all duration-300
                                   bg-gradient-to-br from-brand-500 to-accent-400" />
                                )}
                                {l.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Mobile */}
            <div ref={boxRef} className="sm:hidden relative">
                <button
                    onClick={() => setOpen(v => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className="inline-flex items-center justify-between gap-2 rounded-full
                     bg-zinc-200/60 dark:bg-zinc-700/60 border border-zinc-300/60 dark:border-zinc-600/60
                     hover:shadow-soft transition-all px-3 h-9 min-w-[72px] relative"
                >
          <span className="absolute inset-0 -z-10 rounded-full"
                style={{ padding: 2, background: 'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))' }} />
                    <span className="absolute inset-[2px] rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-sm" />
                    <span className="relative z-10 text-xs font-semibold text-zinc-800 dark:text-zinc-100">
            {currentLang.label}
          </span>
                    <span className="relative z-10 text-xs text-zinc-500 dark:text-zinc-300">▾</span>
                </button>

                {mounted && open && (
                    <ul
                        role="listbox"
                        className="absolute right-0 mt-2 w-28 rounded-xl border border-white/10
                       bg-white/90 dark:bg-black/70 backdrop-blur-xl shadow-lg p-1 z-50"
                    >
                        {langs.map((l) => (
                            <li key={l.code}>
                                <button
                                    role="option"
                                    aria-selected={current.startsWith(l.code)}
                                    onClick={() => changeLanguage(l.code)}
                                    className={`w-full text-left text-sm px-3 py-2 rounded-lg
                             hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60
                             ${current.startsWith(l.code) ? 'font-semibold' : ''}`}
                                >
                                    {l.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
