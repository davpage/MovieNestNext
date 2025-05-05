import Image from 'next/image';

const corsUrl = process.env.NEXT_PUBLIC_CORS_URL;
const kinogoUrl = process.env.NEXT_PUBLIC_KINOGO_URL;

export default function MovieList({ movies, title, loading, onMovieClick, isLoadingMovie }) {
    const handleClick = (movie) => {
        if (isLoadingMovie) return; // Կանխել սեղմումը, եթե բեռնումն ընթացքի մեջ է
        onMovieClick(movie, () => {}); // Դատարկ callback, քանի որ բեռնումը կառավարվում է Home-ում
    };

    return (
        <div className="max-[850px]:w-full h-full min-[850px]:min-w-[350px] overflow-y-auto bg-black/50 backdrop-blur-lg border border-red-900 p-4 shadow-lg">
            <h2 className="text-lg sm:text-xl text-white mb-4">{title}</h2>
            {loading && (
                <div
                    className="w-full h-48 bg-center bg-no-repeat bg-contain"
                    style={{ backgroundImage: "url('/loading.gif')" }}
                />
            )}
            <div className="space-y-4">
                {movies.map((movie, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 p-2 border border-gray-400 text-white rounded-lg bg-white/10 backdrop-blur-lg transition ${
                            isLoadingMovie
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:text-gray-700 cursor-pointer hover:bg-gray-100'
                        }`}
                        onClick={() => handleClick(movie)}
                    >
                        <Image
                            src={
                                movie.img
                                    ? `${kinogoUrl}${movie.img}`
                                    : movie.dataId
                                        ? `https://www.kinopoisk.ru/images/sm_film/${movie.dataId}.jpg`
                                        : '/placeholder.jpg'
                            }
                            alt={movie.title}
                            width={64}
                            height={96}
                            className="w-16 h-24 object-cover rounded"
                        />
                        <div>
                            <div className="font-bold text-sm sm:text-base">{movie.title}</div>
                            <div className="text-xs sm:text-sm">{movie.year}</div>
                            <div className="text-xs sm:text-sm">{movie.duration}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}