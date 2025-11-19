'use client'

import Image from 'next/image'

export default function Logo({ w = 50, h = 34 }) {
    return (
        <>
            {/* 🌞 Light Mode Logo */}
            <Image
                src="/logo/logo-black.svg"
                alt="MovieNest Logo Light"
                width={w}
                height={h}
                className="block dark:hidden transition-transform duration-300 hover:scale-105"
                priority
            />

            {/* 🌙 Dark Mode Logo */}
            <Image
                src="/logo/logo-white.svg"
                alt="MovieNest Logo Dark"
                width={w}
                height={h}
                className="hidden dark:block transition-transform duration-300 hover:scale-105"
                priority
            />
        </>
    )
}
