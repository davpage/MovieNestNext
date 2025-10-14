'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function Toast({ open, type = 'success', message = '', onClose, ms = 2400 }) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    useEffect(() => {
        if (!open) return
        const id = setTimeout(() => onClose?.(), ms)
        return () => clearTimeout(id)
    }, [open, ms, onClose])

    if (!mounted || !open) return null

    const tone = type === 'error'
        ? 'from-rose-500 to-amber-500 ring-rose-400/30'
        : type === 'warning'
            ? 'from-amber-500 to-emerald-500 ring-amber-400/30'
            : 'from-brand-500 to-accent-400 ring-accent-400/30'

    return createPortal(
        <div className="fixed inset-x-0 bottom-4 right-0 z-[9999] grid place-items-center px-4">
            <div className={`max-w-md w-full rounded-2xl px-4 py-3 text-sm font-medium text-white
                       shadow-2xl ring-2 ${'bg-gradient-to-r ' + tone}`}>
                {message}
            </div>
        </div>,
        document.body
    )
}
