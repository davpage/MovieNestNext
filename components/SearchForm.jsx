'use client'
import { useTranslation } from 'react-i18next'
import { FiSearch } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'

export default function SearchForm({
                                       searchInput,
                                       setSearchInput,
                                       handleSearch,
                                       handleCloseFilm,
                                       iframeSrc,
                                       loading,
                                   }) {
    const { t } = useTranslation()

    return (
        <form onSubmit={handleSearch} className="w-full flex gap-2 items-center">
            <div className="relative flex-1 group">
                {/* gradient border with mask trick */}
                <div className="absolute -inset-[1px] rounded-2xl bg-border-gradient opacity-60 group-hover:opacity-100 transition"></div>

                <input
                    id="search"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="relative flex-1 w-full p-3 pr-12 text-base sm:text-lg
                     rounded-2xl border border-white/10
                     bg-gloss dark:bg-gloss backdrop-blur-lg
                     text-zinc-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-accent-400"
                    required
                />

                {/* Desktop enter hint */}
                <span
                    aria-hidden
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 dark:text-zinc-400 hidden sm:inline"
                    title={t('search.pressEnter')}
                >
          ⏎
        </span>

            </div>

            {/* Search Button */}
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-2xl text-white shadow-soft transition
                   bg-btn-gradient hover:opacity-90 disabled:opacity-60 flex items-center justify-center"
                title={t('search.submit')}
            >
                {loading ? (
                    <span className="animate-pulse">{t('search.loading')}</span>
                ) : (
                    <>
                        {/* icon only on mobile */}
                        <FiSearch className="text-lg sm:hidden" />
                        <span className="hidden sm:inline">{t('search.submit')}</span>
                    </>
                )}
            </button>

            {/* Close Button */}
            {iframeSrc && (
                <button
                    type="button"
                    onClick={handleCloseFilm}
                    className="px-4 py-2 rounded-2xl text-white shadow-soft transition
                     bg-btn-gradient-dark hover:opacity-90 flex items-center justify-center"
                    title={t('search.close')}
                >
                    <IoMdClose className="text-lg sm:hidden" />
                    <span className="hidden sm:inline">{t('search.close')}</span>
                </button>
            )}
        </form>
    )
}
