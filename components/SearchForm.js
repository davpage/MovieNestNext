export default function SearchForm({
                                       searchInput,
                                       setSearchInput,
                                       handleSearch,
                                       handleCloseFilm,
                                       iframeSrc,
                                       loading,

                                   }) {
    return (
        <form
            onSubmit={handleSearch}
            className="w-full h-[50px] flex  gap-2"
        >
            <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter film name or Kinopoisk URL/number"
                className="flex-1 w-full p-2 text-lg sm:text-2xl bg-black/50 backdrop-blur-lg border-b border-gray-300 outline-none text-white focus:border-red-900"
                required
            />
            <button
                type="submit"
                className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-950 text-sm sm:text-base"
                disabled={loading}
            >
                Search
            </button>
            {iframeSrc && (
                <button
                    onClick={handleCloseFilm}
                    className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-950 text-sm sm:text-base"
                >
                    Close
                </button>
            )}
        </form>
    );
}