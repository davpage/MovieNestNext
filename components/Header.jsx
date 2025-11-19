'use client'
import {useState} from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import PillLink from './PillLink'
import LocaleSwitcher from './LocaleSwitcher'
import {useTranslation} from 'react-i18next'
import {CiCircleInfo} from "react-icons/ci"
import {HiBars3} from "react-icons/hi2"
import ContactModal from "./ContactModal"
import SearchBar from "@/components/SearchForm";
import {createPortal} from "react-dom";
import {usePathname} from "next/navigation";

export default function Header({
                                   searchInput,
                                   setSearchInput,
                                   handleSearch,
                                   handleCloseFilm,
                                   iframeSrc,
                                   loading
                               }) {
    const {t} = useTranslation()
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()


    return (
        <header className="sticky top-0 z-40 border-b border-white/10
                           backdrop-blur-xl bg-white/40 dark:bg-black/30">

            <div className="mx-auto max-w-6xl px-4 py-3
                            grid grid-cols-[auto_1fr_auto] items-center gap-3">

                {/* LOGO */}
                <Link href="/" className="w-[50px] flex items-center gap-2 group shrink-0">
                    <Logo/>
                </Link>

                {/* SEARCH bar center */}
                <div className="flex justify-center flex-1 min-w-0">
                    {pathname !== '/about' && <SearchBar
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        handleSearch={handleSearch}
                        handleCloseFilm={handleCloseFilm}
                        iframeSrc={iframeSrc}
                        loading={loading}
                    />}
                </div>

                {/* RIGHT SIDE – DESKTOP BUTTONS */}
                <nav className="hidden sm:flex items-center gap-2">
                    <LocaleSwitcher/>
                    <ThemeToggle/>
                    <PillLink href="/about" icon={<CiCircleInfo/>}>{t('nav.about')}</PillLink>
                    <ContactModal/>
                </nav>

                {/* MOBILE HAMBURGER */}
                <button
                    onClick={() => setMenuOpen(true)}
                    className="sm:hidden relative inline-flex items-center justify-center rounded-full
               bg-zinc-200/60 dark:bg-zinc-700/60
               border border-zinc-300/60 dark:border-zinc-600/60
               hover:shadow-soft transition-all w-10 h-10 group"
                >
    <span className="absolute inset-0 -z-10 rounded-full"
          style={{
              padding: 2,
              background: 'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))'
          }}
    />
                    <span className="absolute inset-[2px] rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-sm"/>
                    <span className="relative z-10 text-xl text-zinc-800 dark:text-zinc-100">☰</span>
                    <span className="absolute inset-0 rounded-full pointer-events-none
                        ring-2 ring-brand-500/20 dark:ring-accent-400/25 animate-pulse-slow"
                          style={{clipPath: 'inset(2px round 999px)'}}/>
                </button>


            </div>

            {/* Gradient divider */}
            <div className="h-[1px] w-full bg-gradient-to-r
                            from-brand-500/40 via-accent-400/40 to-flame-400/40"/>

            {/* MOBILE MENU OVERLAY */}
            {menuOpen && (
                createPortal(
                    <div
                        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm
                 flex items-center justify-center"
                        onClick={() => setMenuOpen(false)}
                    >

                        {/* MODAL PANEL */}
                        <div
                            className="relative w-[90%] max-w-sm p-6 rounded-2xl
                   bg-white/60 dark:bg-black/50 backdrop-blur-2xl
                   border border-white/10 shadow-2xl animate-menu-pop"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* gradient halo */}
                            <span className="absolute -inset-[1px] rounded-2xl -z-10"
                                  style={{
                                      background:
                                          'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))'
                                  }}
                            />

                            {/*<h2 className="text-xl font-semibold mb-4 text-center">*/}
                            {/*    {t('nav.menu')}*/}
                            {/*</h2>*/}

                            <div className="flex flex-col gap-3">
                                <ContactModal/>
                                <PillLink href="/about" size="md" icon={<CiCircleInfo/>}>
                                    {t('nav.about')}
                                </PillLink>
                                <div className={'flex gap-2'}>
                                    <LocaleSwitcher/>
                                    <ThemeToggle/>
                                </div>
                            </div>

                            <button
                                onClick={() => setMenuOpen(false)}
                                className="w-full mt-4 h-10 rounded-xl bg-white/40 dark:bg-black/30
                     border border-white/10 hover:bg-white/60 dark:hover:bg-black/50"
                            >
                                {t('common.close')}
                            </button>

                        </div>
                    </div>,
                    document.body
                )
            )}

        </header>
    )
}
