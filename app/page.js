'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import SearchForm from '../components/SearchForm'
import MovieList from '../components/MovieList'
import MoviePlayer from '../components/MoviePlayer'
import { Toast } from '../components/Toast' // ⬅️ Ավելացրու սա

const corsUrl = process.env.NEXT_PUBLIC_CORS_URL
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
const kinopoiskSearchUrl = process.env.NEXT_PUBLIC_KINOPOISK_SEARCH_URL
const ddbbUrl = process.env.NEXT_PUBLIC_DDBB_URL

export default function Home() {
    const { t } = useTranslation()

    const [searchInput, setSearchInput] = useState('')
    const [movies, setMovies] = useState([])
    const [iframeSrc, setIframeSrc] = useState('')
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState(t('home.topMovies'))
    const [movieTitle, setMovieTitle] = useState(t('home.pickAndEnjoy'))
    const [downloadUrl, setDownloadUrl] = useState('')
    const [trailer, setTrailer] = useState('')
    const [isLoadingMovie, setIsLoadingMovie] = useState(null)

    // 🔔 local toast
    const [toast, setToast] = useState({ open: false, type: 'success', message: '' })
    const notify = (type, message) => setToast({ open: true, type, message })

    // keep titles in sync when language changes
    useEffect(() => {
        if (!iframeSrc) setMovieTitle(t('home.pickAndEnjoy'))
        if (movies.length === 0) setTitle(t('home.topMovies'))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t, iframeSrc, movies.length])

    useEffect(() => {
        const fetchTopMovies = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${backendUrl}/movies`, { next: { revalidate: 3600 } })
                const data = await res.json()
                setMovies(Array.isArray(data) ? data : [])
            } catch (error) {
                notify('error', `${t('alerts.oops')}: ${t('alerts.fetchFailed')}`)
            } finally {
                setLoading(false)
            }
        }
        fetchTopMovies()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]) // optional: refetch on lang change

    useEffect(() => {
        const savedUrl = localStorage.getItem('selectedURL')
        const savedName = localStorage.getItem('selectedName')
        if (savedUrl && savedName) {
            setIframeSrc(savedUrl)
            setMovieTitle(savedName)
        }
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault()
        setLoading(true)
        setTitle(t('home.loading'))

        if (/^\d+$/.test(searchInput) || searchInput.includes('kinopoisk')) {
            const number = searchInput.match(/\d+/)[0]
            const url = `${ddbbUrl}?id=${number}&n=0`
            setIframeSrc(url)
            localStorage.setItem('selectedURL', url)
            localStorage.setItem('selectedName', t('home.none'))
            setTitle(t('home.searchResults'))
            setLoading(false)
            return
        }

        try {
            const res = await fetch(corsUrl + kinopoiskSearchUrl + encodeURIComponent(searchInput))
            if (!res.ok) throw new Error(`Request failed: ${res.status}`)
            const html = await res.text()
            const doc = new DOMParser().parseFromString(html, 'text/html')
            const results = Array.from(doc.querySelectorAll('.search_results .element')).map((el) => {
                const titleEl = el.querySelector('.name a.js-serp-metrika')
                const yearEl = el.querySelector('.year')
                const durationEl = el.querySelector('.gray')
                const dataId = titleEl?.getAttribute('data-id')
                return {
                    title: titleEl?.textContent.trim() || t('home.unknown'),
                    year: yearEl?.textContent || t('home.unknownYear'),
                    duration: durationEl?.textContent || '',
                    dataId,
                    status: t('home.searchResults'),
                }
            })
            setMovies(results)
            setTitle(t('home.searchResults'))
        } catch {
            setTitle(t('home.reload'))
            notify('error', `${t('alerts.oops')}: ${t('alerts.fetchFailed')}`)
        } finally {
            setLoading(false)
        }
    }

    const handleMovieClick = async (movie, onLoadComplete) => {
        if (isLoadingMovie) return
        setIsLoadingMovie(movie.dataId || movie.url)
        try {
            if (movie.dataId && movie.status === t('home.searchResults')) {
                const url = `${ddbbUrl}?id=${movie.dataId}&n=0`
                setIframeSrc(url)
                setMovieTitle(movie.title)
                localStorage.setItem('selectedURL', url)
                localStorage.setItem('selectedName', movie.title)
                onLoadComplete?.()
            } else if (movie.url && movie.status === t('home.topMovies')) {
                const response = await fetch(`${backendUrl}/movie-page?url=${encodeURIComponent(movie.url)}`)
                const data = await response.json()
                if (data.iframeSrc) {
                    setIframeSrc(data.iframeSrc)
                    setMovieTitle(movie.title)
                    localStorage.setItem('selectedURL', data.iframeSrc)
                    localStorage.setItem('selectedName', movie.title)
                    if (data.trailer) setTrailer(data.trailer)
                    onLoadComplete?.()
                } else {
                    throw new Error('No valid iframe source')
                }
            }
        } catch {
            notify('error', `${t('alerts.oops')}: ${t('alerts.loadFailed')}`)
            setIsLoadingMovie(null)
            onLoadComplete?.()
        }
    }

    const handleIframeLoad = () => setIsLoadingMovie(null)

    const handleCloseFilm = () => {
        setTrailer('')
        setIframeSrc('')
        setMovieTitle('')
        setDownloadUrl('')
        setIsLoadingMovie(null)
        localStorage.removeItem('selectedURL')
        localStorage.removeItem('selectedName')
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

            <main className="mx-auto max-w-6xl px-4 py-4 grid grid-cols-1 md:grid-cols-[380px_1fr] gap-4">
                {/* left column */}
                <section className="md:order-1 order-2">
                    <MovieList
                        movies={movies}
                        title={title}
                        loading={loading}
                        onMovieClick={handleMovieClick}
                        isLoadingMovie={isLoadingMovie}
                    />
                </section>

                {/* right column */}
                <section className="md:order-2 order-1 space-y-4">
                    <SearchForm
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        handleSearch={handleSearch}
                        handleCloseFilm={handleCloseFilm}
                        iframeSrc={iframeSrc}
                        loading={loading}
                    />
                    <MoviePlayer
                        iframeSrc={iframeSrc}
                        movieTitle={movieTitle}
                        downloadUrl={downloadUrl}
                        trailer={trailer}
                        onIframeLoad={handleIframeLoad}
                    />
                </section>
            </main>
        </>
    )
}
