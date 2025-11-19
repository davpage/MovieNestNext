import Image from "next/image";

export default function SearchMovieCard({ movie, handleClick, isLoading }) {
    const imgSrc = `https://www.kinopoisk.ru/images/sm_film/${movie.dataId}.jpg`;

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`
        group relative w-full flex items-stretch gap-3 p-3 rounded-2xl
        border border-white/10 dark:border-white/10
        bg-white/40 dark:bg-black/30 backdrop-blur-md
        transition
        hover:-translate-y-[2px] hover:shadow-soft
        
        ${isLoading ? "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none grayscale-[60%]" : ""}
    `}
        >

            {/* Poster */}
            <div className="relative w-16 h-24 shrink-0 rounded-lg overflow-hidden">
                <Image
                    src={imgSrc}
                    alt={movie.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">

                {/* Title */}
                <div>
                    <div
                        className="font-semibold text-sm sm:text-base text-start line-clamp-2 text-zinc-900 dark:text-zinc-100">
                        {movie.title}
                    </div>

                    {movie.engName && (
                        <div className="text-xs text-zinc-400 text-start mt-0.5">
                            {movie.engName}
                        </div>
                    )}

                    <div className="mt-1 text-xs flex items-center gap-2 text-zinc-500">
                        {movie.year && <span>{movie.year}</span>}
                        {movie.duration && <><span>•</span> <span>{movie.duration}</span></>}
                    </div>
                </div>

                {/* Country - Director */}
                {(movie.country || movie.director) && (
                    <div className="flex gap-2 flex-wrap mt-1">
                        {movie.country && (
                            <span className="bg-zinc-500/10 px-2 py-1 rounded-md text-[11px]">
                                🌍 {movie.country}
                            </span>
                        )}
                        {movie.director && (
                            <span className="bg-zinc-500/10 px-2 py-1 rounded-md text-[11px]">
                                🎬 {movie.director}
                            </span>
                        )}
                    </div>
                )}

                {/* Genres */}
                {movie.genre?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {movie.genre.slice(0, 4).map((g, idx) => (
                            <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                            >
                {g.charAt(0).toUpperCase() + g.slice(1)}
            </span>
                        ))}
                    </div>
                )}


                {/* Actors */}
                {movie.actors?.length > 0 && (
                    <div className="text-[11px] text-zinc-500 text-start mt-1 line-clamp-1">
                        ⭐ {movie.actors.slice(0, 3).join(", ")}
                    </div>
                )}
            </div>
        </button>
    );
}
