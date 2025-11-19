import Image from "next/image";

const kinogoUrl = process.env.NEXT_PUBLIC_KINOGO_URL;

export default function TopMovieCard({movie, handleClick, isLoading}) {

    const imgSrc = movie.img
        ? `${kinogoUrl}${movie.img}`
        : "/placeholder.jpg";

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

                <div
                    className="font-semibold text-sm text-start sm:text-base line-clamp-2 text-zinc-900 dark:text-zinc-100">
                    {movie.title}
                </div>

                <div className="mt-1 text-xs flex items-center gap-2 text-zinc-500">
                    {movie.year && <span>{movie.year}</span>}
                </div>

                {/* Genres */}
                {movie.genres?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {movie.genres.slice(0, 4).map((g, idx) => (
                            <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-600/15 text-indigo-700 dark:text-indigo-300"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Ratings */}
            <div className="w-[80px] flex flex-col items-end justify-center gap-2 text-xs">
                {movie.ratings?.[0] && (
                    <span className="px-2 py-1 bg-orange-600 text-white rounded-md">
                        {movie.ratings[0]}
                    </span>
                )}
                {movie.ratings?.[1] && (
                    <span className="px-2 py-1 bg-yellow-300 text-black rounded-md">
                        {movie.ratings[1]}
                    </span>
                )}
            </div>
        </button>
    );
}
