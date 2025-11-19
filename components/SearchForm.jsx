'use client'
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "react-i18next";

export default function SearchBar({
                                      searchInput,
                                      setSearchInput,
                                      handleSearch,
                                      handleCloseFilm,
                                      iframeSrc,
                                      loading,
                                  }) {
    const { t } = useTranslation();

    return (
        <form
            onSubmit={handleSearch}
            className="relative flex items-center flex-1 h-9 min-w-0 group"
        >
            {/* Gradient Halo */}
            <span
                className="absolute inset-0 -z-10 rounded-full"
                style={{
                    padding: 2,
                    background:
                        "linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.35))",
                }}
            />

            {/* Glass background */}
            <span className="absolute inset-[2px] rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-sm" />

            <div className="relative z-10 flex items-center w-full min-w-0 px-2 gap-2">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => {
                        const text = e.target.value;

                        // extract KP ID dynamically as user types or pastes
                        const match = text.match(/(\d+)/);
                        if (text.includes("kinopoisk.ru") && match) {
                            setSearchInput(match[1]); // show only ID
                        } else {
                            setSearchInput(text);
                        }
                    }}
                    placeholder="Search"
                    className="relative z-10 flex-1 px-3 py-1.5 pr-10 bg-transparent
           text-sm text-zinc-900 dark:text-white
           placeholder:text-zinc-500 dark:placeholder:text-zinc-400
           focus:outline-none"
                />


                <button
                    type="submit"
                    className="absolute right-3 text-zinc-600 dark:text-zinc-300 hover:text-accent-400 transition"
                >
                    <FiSearch className="text-base"/>
                </button>
            </div>
        </form>
    );
}
