'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import PillLink from './PillLink'
import LocaleSwitcher from './LocaleSwitcher'
import { useTranslation } from 'react-i18next'
import {CiCircleInfo} from "react-icons/ci";
import ContactModal from "../components/ContactModal";
import {MdOutlineMessage} from "react-icons/md";

export default function Header() {
    const { t } = useTranslation()
    return (
        <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl bg-white/40 dark:bg-black/30">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2 group">
                    <Logo w={44} h={30} />
                </Link>

                <nav className="ml-auto flex items-center gap-2">
                    <LocaleSwitcher />
                    <ThemeToggle />
                    <PillLink href="/about" size="md" className="!min-w-[44px]" icon={<CiCircleInfo />}>
                        {/* 👇 տեքստը միայն ≥sm էկրաններին */}

                        <span className="hidden sm:inline !min-w-[44px]">{t('nav.about')}</span>
                    </PillLink>
                    <ContactModal />

                </nav>
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-brand-500/40 via-accent-400/40 to-flame-400/40" />

        </header>
    )
}
