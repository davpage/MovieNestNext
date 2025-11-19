'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import emailjs from '@emailjs/browser'
import PillLink from '../components/PillLink'
import { MdOutlineMessage } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { Toast } from '../components/Toast' // ⬅️ Ավելացրու սա

export default function ContactModal() {
    const { t } = useTranslation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [rating, setRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const dialogRef = useRef(null)
    const firstFieldRef = useRef(null)

    // 🔔 local toast
    const [toast, setToast] = useState({ open: false, type: 'success', message: '' })
    const notify = (type, message) => setToast({ open: true, type, message })

    // Lock body scroll while open
    useEffect(() => {
        if (!isModalOpen) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [isModalOpen])

    // Focus first field on open
    useEffect(() => {
        if (isModalOpen) setTimeout(() => firstFieldRef.current?.focus(), 0)
    }, [isModalOpen])

    const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).toLowerCase())

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim() || !email.trim() || !message.trim()) {
            notify('warning', t('contact.fillAll') || 'Please fill in all fields.')
            return
        }
        if (!validateEmail(email)) {
            notify('warning', t('contact.invalidEmail') || 'Please enter a valid email address.')
            return
        }

        setIsSubmitting(true)
        try {
            await emailjs.send(
                'geuphmh',
                'l6p2mq8222',
                { name, email, message, rating },
                'Xh3WhTefsno6bxN5J'
            )
            notify('success', t('contact.sent') || 'Message sent successfully!')
            setIsModalOpen(false)
            setName(''); setEmail(''); setMessage(''); setRating(0)
        } catch (err) {
            notify('error', t('contact.failed') || 'Failed to send message. Please try again later.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {/* Toast container */}
            <Toast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((p) => ({ ...p, open: false }))}
                ms={2400}
            />

            {/* Trigger — pill button */}
            <PillLink
                size="md"
                icon={<MdOutlineMessage />}
                onClick={() => setIsModalOpen(true)}
                className="!min-w-[44px]"
            >
            {t('nav.contact')}
            </PillLink>

            {/* Modal via portal */}
            {isModalOpen && createPortal(
                <ModalShell onClose={() => setIsModalOpen(false)}>
                    <div
                        ref={dialogRef}
                        className="relative w-full max-w-sm max-h-[85vh] overflow-hidden
              rounded-2xl border border-white/10
              bg-white/60 dark:bg-black/50 backdrop-blur-2xl shadow-2xl"
                        role="dialog" aria-modal="true" aria-labelledby="contact-title"
                    >
            <span
                className="pointer-events-none absolute -inset-[1px] rounded-2xl -z-10"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))' }}
            />

                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <h2 id="contact-title" className="text-lg font-semibold">{t('contact.title') || 'Contact Us'}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="h-9 w-9 inline-flex items-center justify-center rounded-xl
                  bg-zinc-200/60 dark:bg-zinc-700/60
                  border border-zinc-300/60 dark:border-zinc-600/60 hover:shadow-soft"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-3">
                            <Input
                                ref={firstFieldRef}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('contact.name') || 'Your Name'}
                                autoComplete="name"
                            />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('contact.email') || 'Your Email'}
                                autoComplete="email"
                            />
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t('contact.message') || 'Your Message'}
                                rows={4}
                            />

                            {/* Rating */}
                            <div className="text-center">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {t('contact.rate') || 'Rate your experience:'}
                                </p>
                                <div className="mt-1 flex justify-center flex-row-reverse text-2xl cursor-pointer">
                                    {[5,4,3,2,1].map((v) => (
                                        <span
                                            key={v}
                                            className={`mx-1 ${rating >= v ? 'text-yellow-400' : 'text-zinc-400'}
                        hover:text-yellow-400 transition-transform hover:scale-110`}
                                            onClick={() => setRating(v)}
                                            aria-label={`Rate ${v}`}
                                        >
                      ★
                    </span>
                                    ))}
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    {t('contact.yourRating') || 'Your rating:'}{' '}
                                    <span className="font-semibold text-yellow-400">{rating}</span>
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="pt-1 flex items-center gap-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-10 rounded-xl text-white bg-btn-gradient hover:opacity-90 disabled:opacity-60
                    inline-flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && (
                                        <span className="border-2 border-white/30 border-t-white rounded-full w-4 h-4 animate-spin" />
                                    )}
                                    {isSubmitting ? (t('contact.sending') || 'Sending...') : (t('contact.send') || 'Send')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="h-10 px-4 rounded-xl border border-white/10 bg-white/40 dark:bg-black/30
                    hover:bg-white/60 dark:hover:bg-black/50"
                                >
                                    {t('common.close') || 'Close'}
                                </button>
                            </div>
                        </form>
                    </div>
                </ModalShell>,
                document.body
            )}
        </>
    )
}

/* ModalShell stays the same */
function ModalShell({ children, onClose }) {
    const containerRef = useRef(null)

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose()
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [onClose])

    return (
        <div className="fixed inset-0 z-[9999] inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative grid place-items-center min-h-[100dvh] px-4" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

/* Small UI atoms */
const Input = React.forwardRef(function Input({ className = '', ...props }, ref) {
    return (
        <input
            ref={ref}
            {...props}
            className={`w-full h-10 px-3 rounded-xl
        bg-black/20 dark:bg-white/5 text-zinc-900 dark:text-white
        border border-white/10 outline-none
        focus:ring-2 focus:ring-accent-400 focus:border-transparent
        placeholder:text-zinc-500 dark:placeholder:text-zinc-400
        backdrop-blur ${className}`}
        />
    )
})

function Textarea({ className = '', ...props }) {
    return (
        <textarea
            {...props}
            className={`w-full px-3 py-2 rounded-xl resize-none
        bg-black/20 dark:bg-white/5 text-zinc-900 dark:text-white
        border border-white/10 outline-none
        focus:ring-2 focus:ring-accent-400 focus:border-transparent
        placeholder:text-zinc-500 dark:placeholder:text-zinc-400
        backdrop-blur ${className}`}
        />
    )
}
