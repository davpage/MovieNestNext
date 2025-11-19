'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    const isDark = theme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className={`relative inline-flex items-center Z rounded-full
                  bg-zinc-200/60 dark:bg-zinc-700/60
                  border border-zinc-300/60 dark:border-zinc-600/60
                  hover:shadow-soft transition-all`}
            style={{ width: 80, height: 38 }}
        >
            {/* gradient border halo */}
            <span className="absolute inset-0 -z-10 rounded-full"
                  style={{ padding: 2, background: 'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))' }} />
            <span className="absolute inset-[2px] rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-sm" />

            {/* labels */}
           <span className={`absolute ${isDark ? "left-0 text-zinc-300":"right-0 text-zinc-700"} px-2 text-xs font-medium `}>{!isDark ? "Light":"Dark"}</span>

            {/* thumb */}
            <span
                className={`absolute ml-1 h-8 w-8
                    rounded-full shadow-glass flex items-center justify-center
                    transition-all duration-300
                    ${isDark ? 'translate-x-[40px] bg-gradient-to-br from-accent-400 to-flame-400' : 'translate-x-0 bg-gradient-to-br from-brand-500 to-accent-500'}`}
                style={{ height: 30, width: 30 }}
            >
        <span className="text-base">{isDark ? '🌙' : '☀️'}</span>
      </span>

            {/* check ripple */}
            <span
                className={`absolute inset-0 rounded-full pointer-events-none
                    ${isDark ? 'ring-2 ring-accent-400/40' : 'ring-2 ring-brand-500/30'} animate-pulse-slow`}
                style={{ clipPath: 'inset(2px round 999px)' }}
            />
        </button>
    )
}
