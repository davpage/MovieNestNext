import Image from 'next/image'
import {useTranslation} from "react-i18next";

const kinogoUrl = process.env.NEXT_PUBLIC_KINOGO_URL

export default function MovieList({ movies, title, loading, onMovieClick, isLoadingMovie }) {
    const { t } = useTranslation()

    const handleClick = (movie) => {
        if (isLoadingMovie) return
        onMovieClick({ ...movie, status: title }, () => {})
    }

    return (
        <aside
            className="w-full h-full max-h-[86vh] overflow-y-auto
                 rounded-2xl p-4 border border-white/10 dark:border-white/10
                 bg-white/50 dark:bg-black/30 backdrop-blur-xl shadow-soft"
            aria-busy={loading}
        >
            <h2 className="text-lg sm:text-xl font-semibold text-start text-zinc-900 dark:text-white mb-4">
                {t(title)}
            </h2>

            {/* SKELETONS */}
            {loading && (
                <ul className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <li key={i} className="relative overflow-hidden rounded-2xl">
                            <div className="flex items-stretch gap-3 p-2 rounded-2xl
                              bg-white/40 dark:bg-black/30 border border-white/10 animate-pulse">
                                <div className="w-16">
                                    <div className="w-16 h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                                    <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                                    <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
                                </div>
                                <div className="w-20 space-y-2">
                                    <div className="h-6 rounded bg-zinc-200 dark:bg-zinc-800" />
                                    <div className="h-6 rounded bg-zinc-200 dark:bg-zinc-800" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* LIST */}
            {!loading && (
                <ul className="space-y-3">
                    {movies.map((movie, i) => {
                        const imgSrc = movie?.img
                            ? `${kinogoUrl}${movie?.img}`
                            : movie?.dataId
                                ? `https://www.kinopoisk.ru/images/sm_film/${movie.dataId}.jpg`
                                : '/placeholder.jpg'

                        return (
                            <li key={`${movie.dataId ?? movie.title}-${i}`}>
                                <button
                                    onClick={() => handleClick(movie)}
                                    className={`group relative w-full flex items-stretch gap-3 p-2 rounded-2xl text-left
                              border border-white/10 dark:border-white/10
                              bg-white/40 dark:bg-black/30 backdrop-blur-md
                              transition hover:-translate-y-[2px] hover:shadow-soft
                              ${isLoadingMovie ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    aria-disabled={Boolean(isLoadingMovie)}
                                >
                                    {/* gradient halo */}
                                    <span
                                        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition"
                                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))' }}
                                    />

                                    {/* Poster */}
                                    <div className="relative w-16 shrink-0">
                                        <div className="relative w-16 h-24 rounded-lg overflow-hidden">
                                            <Image
                                                src={imgSrc}
                                                alt={movie?.title ?? 'Poster'}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="font-semibold text-start text-sm sm:text-base text-zinc-900 dark:text-zinc-100 line-clamp-2">
                                                {movie?.title}
                                            </div>
                                            <div className="mt-0.5 text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                                {movie?.year && <span>{movie.year}</span>}
                                                {movie?.duration && (
                                                    <>
                                                        <span aria-hidden="true">•</span>
                                                        <span>{movie.duration}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Genres */}
                                        {Array.isArray(movie?.genres) && movie.genres.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {movie.genres.slice(0, 4).map((g, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-1.5 py-0.5 rounded-full text-[10px] leading-4
                                       bg-indigo-600/15 text-indigo-700 dark:text-indigo-300"
                                                    >
                            {g}
                          </span>
                                                ))}
                                                {movie.genres.length > 4 && (
                                                    <span className="px-1.5 py-0.5 rounded-full text-[10px] leading-4 bg-zinc-500/10 text-zinc-500">
                            +{movie.genres.length - 4}
                          </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Ratings (right column, fixed width) */}
                                    <div className="w-[84px] shrink-0 flex flex-col items-end justify-center gap-2 pr-1">
                                        {Array.isArray(movie?.ratings) && movie.ratings.length > 0 && (
                                            <>
                                                {movie.ratings[0] && (
                                                    <span
                                                        className={`px-2 py-1 rounded-md text-xs whitespace-nowrap
                                        ${movie.ratings[0].startsWith('IMDb') ? 'bg-yellow-300 text-black' : 'bg-orange-600 text-white'}`}
                                                    >
                            {movie.ratings[0]}
                          </span>
                                                )}
                                                {movie.ratings[1] && (
                                                    <span
                                                        className={`px-2 py-1 rounded-md text-xs whitespace-nowrap
                                        ${movie.ratings[1].startsWith('IMDb') ? 'bg-yellow-300 text-black' : 'bg-orange-600 text-white'}`}
                                                    >
                            {movie.ratings[1]}
                          </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}

            {/* EMPTY STATE */}
            {!loading && movies?.length === 0 && (
                <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
                    Չկան արդյունքներ։
                </div>
            )}
        </aside>
    )
}
