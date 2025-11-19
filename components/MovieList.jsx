import {useTranslation} from "react-i18next";
import SearchMovieCard from "@/components/cards/SearchMovieCard";
import TopMovieCard from "@/components/cards/TopMovieCard";

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
                        const isSearchResult = !!movie.dataId;

                        return (
                            <li key={i}>
                                {isSearchResult ? (
                                    <SearchMovieCard
                                        movie={movie}
                                        handleClick={() => handleClick(movie)}
                                        isLoading={isLoadingMovie}
                                    />
                                ) : (
                                    <TopMovieCard
                                        movie={movie}
                                        handleClick={() => handleClick(movie)}
                                        isLoading={isLoadingMovie}
                                    />
                                )}
                            </li>
                        );
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
