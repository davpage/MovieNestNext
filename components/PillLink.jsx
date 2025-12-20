'use client'
import Link from 'next/link'

export default function PillLink({
                                     href,                 // եթե կա → <Link>, եթե չկա → <button>
                                     onClick,
                                     children,
                                     className = '',
                                     size = 'md',          // 'sm' | 'md' | 'lg'
                                     icon = null,
                                     type = 'button',      // button type when rendered as <button>
                                     target = '',
                                 }) {
    const sizes = {
        sm: {w: 72, h: 32, px: 'px-3', text: 'text-xs'},
        md: {w: 48, h: 36, px: 'px-3', text: 'text-sm'},
        lg: {w: 96, h: 40, px: 'px-4', text: 'text-base'},
    }
    const s = sizes[size] ?? sizes.md

    const baseClasses = `
    relative inline-flex items-center justify-center rounded-full
    bg-zinc-200/60 dark:bg-zinc-700/60
    border border-zinc-300/60 dark:border-zinc-600/60
    hover:shadow-soft transition-all focus:outline-none
    ${s.px} ${s.text} ${className}
  `
    const inner = (
        <>
            {/* gradient border halo */}
            <span
                className="absolute inset-0 -z-10 rounded-full"
                style={{padding: 2, background: 'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))'}}
            />
            {/* glass inner */}
            <span className="absolute inset-[2px] rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-sm"/>

            {/* content */}
            <span className="relative z-10 inline-flex items-center gap-1.5 text-zinc-800 dark:text-zinc-100">
        {icon ? <span className="text-base leading-none">{icon}</span> : null}
                <span className="leading-none">{children}</span>
      </span>

            {/* subtle ring */}
            <span
                className="absolute inset-0 rounded-full pointer-events-none ring-2 ring-brand-500/20 dark:ring-accent-400/25 animate-pulse-slow"
                style={{clipPath: 'inset(2px round 999px)'}}
            />
        </>
    )

    if (href) {
        return (
            <Link href={href} target={target} prefetch={false} className={baseClasses} style={{height: s.h, minWidth: s.w}}>
                {inner}
            </Link>
        )
    }

    return (
        <button type={type} onClick={onClick} className={baseClasses} style={{height: s.h, minWidth: s.w}}>
            {inner}
        </button>
    )
}
