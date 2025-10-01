'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import Script from 'next/script'

export default function MoviePlayer({ iframeSrc, movieTitle, downloadUrl, trailer, onIframeLoad }) {
    const hasMovie = Boolean(iframeSrc && movieTitle)

    // OPTIONAL: inject Movie JSON-LD for SEO when we have title
    const movieLd = hasMovie
        ? {
            '@context': 'https://schema.org',
            '@type': 'Movie',
            name: movieTitle,
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '8.0',
                ratingCount: '100' // եթե ունես իրական թվեր՝ փոխի
            }
        }
        : null

    useEffect(() => {
        if (movieTitle) document.title = `${movieTitle} | MovieNest`
    }, [movieTitle])

    return (
        <div className="flex flex-col gap-2">
            {hasMovie && (
                <>
                    <iframe
                        src={trailer ? trailer : iframeSrc}
                        allowFullScreen
                        loading="lazy"
                        onLoad={onIframeLoad}
                        className="w-full h-[70vh] max-[850px]:h-[220px] rounded-2xl
           border border-white/10 bg-black/30 backdrop-blur-md shadow-soft"
                    />
                    {/* Movie JSON-LD */}
                    {movieLd && (
                        <Script id="ld-movie" type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(movieLd) }}
                        />
                    )}
                </>
            )}

            <div className="w-full flex items-center justify-between">
                <p className="text-lg sm:text-2xl font-semibold text-zinc-900 dark:text-white truncate">
                    {movieTitle}
                </p>
                <div className="flex gap-2">
                    {trailer && (
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                // handled in parent with state, left minimal to keep your logic
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                        >
                            Trailer
                        </a>
                    )}
                    {downloadUrl && (
                        <Link
                            href={downloadUrl}
                            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                        >
                            Download
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
