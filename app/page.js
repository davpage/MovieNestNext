'use client';

import {useState, useEffect} from 'react';
import Swal from 'sweetalert2';
import SearchForm from '../components/SearchForm';
import MovieList from '../components/MovieList';
import MoviePlayer from '../components/MoviePlayer';
import ContactModal from '../components/ContactModal';
import Image from 'next/image';
// import backgroundPhoto from '@/public/bgPhoto.jpeg'
// import backgroundPhoto from '@/public/background.jpg'
import backgroundPhoto from '@/public/back.png'

const corsUrl = process.env.NEXT_PUBLIC_CORS_URL;
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const kinopoiskSearchUrl = process.env.NEXT_PUBLIC_KINOPOISK_SEARCH_URL;
const ddbbUrl = process.env.NEXT_PUBLIC_DDBB_URL;

export default function Home() {
    const [searchInput, setSearchInput] = useState('');
    const [movies, setMovies] = useState([]);
    const [iframeSrc, setIframeSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('Top Movies');
    const [movieTitle, setMovieTitle] = useState('Select And Enjoy Movies');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [trailer, setTrailer] = useState('');
    const [isLoadingMovie, setIsLoadingMovie] = useState(null);

    useEffect(() => {
        const fetchTopMovies = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${backendUrl}/movies`);
                const data = await res.json(); // ✅ JSON, ոչ թե HTML

                setMovies(data);
            } catch (error) {
                // console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "An error occurred while fetching the best movies."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTopMovies();
    }, []);


    useEffect(() => {
        const loadFilmFromLocalStorage = () => {
            const savedUrl = localStorage.getItem('selectedURL');
            const savedName = localStorage.getItem('selectedName');

            if (savedUrl && savedName) {
                setIframeSrc(savedUrl);
                setMovieTitle(savedName);
                // fetchTitleAndHLS(savedUrl);
            }
        };

        loadFilmFromLocalStorage();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTitle('Loading Please Wait...');

        if (/^\d+$/.test(searchInput) || searchInput.includes('kinopoisk')) {
            const number = searchInput.match(/\d+/)[0];
            setIframeSrc(`${ddbbUrl}?id=${number}&n=0`);
            localStorage.setItem('selectedURL',`${ddbbUrl}?id=${number}&n=0`);
            localStorage.setItem('selectedName','None');
            // fetchTitleAndHLS(number);
            setTitle('Search Results');
            setLoading(false);
        } else {
            try {
                const res = await fetch(corsUrl + kinopoiskSearchUrl + encodeURIComponent(searchInput));
                if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const searchResults = doc.querySelectorAll('.search_results .element');

                if (searchResults.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Results',
                        text: 'No results found.',
                    });
                    setTitle('Search Results');
                    setMovies([]);
                    setLoading(false);
                    return;
                }

                const results = Array.from(searchResults).map((result) => {
                    const titleElement = result.querySelector('.name a.js-serp-metrika');
                    const yearElement = result.querySelector('.year');
                    const durationElement = result.querySelector('.gray');
                    const dataId = titleElement?.getAttribute('data-id');

                    return {
                        title: titleElement?.textContent.trim() || 'Unknown',
                        year: yearElement?.textContent || 'Unknown Year',
                        duration: durationElement?.textContent || '',
                        dataId,
                    };
                });

                setMovies(results);
                setTitle('Search Results');
            } catch (error) {
                setTitle('Oops Please Reload Page!');
            } finally {
                setLoading(false);
            }
        }
    };


    const fetchTitleAndHLS = async (extractedNumber) => {
        // const apiUrl = `${process.env.NEXT_PUBLIC_KINOBOX_API}?kinopoisk=${extractedNumber}&sources=turbo%2Ccollaps%2Calloha%2Cvibix%2Cvideocdn%2Chdvb%2Ckodik`;
        const apiUrl = `${process.env.NEXT_PUBLIC_ATOMICS_API}${extractedNumber}`;
        try {
            let iframeUrl = '';
            if (typeof extractedNumber === 'number' || /^\d+$/.test(extractedNumber)) {
                const res = await fetch(apiUrl);
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                const data = await res.json();
                iframeUrl = data[1]?.translations?.[0]?.iframeUrl;
            } else {
                iframeUrl = extractedNumber;
            }

            if (iframeUrl) {
                const response = await fetch(iframeUrl, {
                    mode: 'cors',
                    credentials: 'include',
                });
                if (!response.ok) throw new Error(`Request failed: ${response.status}`);
                const html = await response.text();

                const titleMatch = html.match(/<title>(.*?)<\/title>/);
                let encodedName = '';
                if (titleMatch) {
                    setMovieTitle(titleMatch[1]);
                    document.title = titleMatch[1];
                    encodedName = encodeURIComponent(titleMatch[1]);
                }

                const hlsRegex = /https?:\/\/[^\s"]+\.m3u8[^\s"]*/;
                const hlsLink = html.match(hlsRegex);
                let encodedHls = '';
                if (hlsLink) {
                    encodedHls = encodeURIComponent(hlsLink[0]);
                }

                if (encodedName && encodedHls) {
                    const downloadUrl = `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}?m=${encodedHls}&name=${encodedName}`;
                    setDownloadUrl(downloadUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching HLS:', error);
        }
    };
    const handleMovieClick = async (movie, onLoadComplete) => {
        // console.log(movie)
        if (isLoadingMovie) return; // Կանխել սեղմումը, եթե բեռնումն ընթացքի մեջ է
        setIsLoadingMovie(movie.dataId || movie.url);
        try {
            if (movie.dataId && movie.status==="Search Results") {
                setIframeSrc(`${ddbbUrl}?id=${movie.dataId}&n=0`);
                setMovieTitle(movie.title);
                localStorage.setItem('selectedURL', `${ddbbUrl}?id=${movie.dataId}&n=0`);
                localStorage.setItem('selectedName', movie.title);
                // fetchTitleAndHLS(movie.dataId);
                onLoadComplete();
            } else if (movie.url && movie.status === "Top Movies") {
                const response = await fetch(`${backendUrl}/movie-page?url=${encodeURIComponent(movie.url)}`);
                const data = await response.json();

                if (data.iframeSrc) {
                    setIframeSrc(data.iframeSrc);
                    setMovieTitle(movie.title);
                    localStorage.setItem('selectedURL', data.iframeSrc);
                    localStorage.setItem('selectedName', movie.title);

                    if (data.trailer) {
                        setTrailer(data.trailer);
                    }

                    onLoadComplete();
                } else {
                    throw new Error("No valid iframe source found");
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to load movie.',
            });
            setIsLoadingMovie(null); // Դադարեցնել բեռնման վիճակը սխալի դեպքում
            onLoadComplete(); // Դադարեցնել բեռնման վիճակը, եթե սխալ կա
        }
    };
    const handleIframeLoad = () => {
        setIsLoadingMovie(null); // Հեռացնել բեռնման վիճակը, երբ iframe-ը բեռնվել է
    };
    const handleCloseFilm = () => {
        // localStorage.clear();
        setTrailer('')
        setIframeSrc('');
        setMovieTitle('');
        setDownloadUrl('');
        setIsLoadingMovie(null);
    };

    return (
        <>
            {/* Ֆոնային նկար */}
            <Image
                src={backgroundPhoto}
                alt="Movie Background"
                width={2000}
                height={1500}
                className="absolute top-0 object-cover w-full h-[100vh] -z-10"
            />


            {/* Բովանդակություն */}
            <div className="h-[100vh] p-4 flex  gap-4">
                <div className='flex flex-col gap-2 max-[850px]:w-full'>
                    <div className='max-[850px]:block hidden'>
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
                    </div>
                    <MovieList
                        movies={movies}
                        title={title}
                        loading={loading}
                        onMovieClick={handleMovieClick}
                        isLoadingMovie={isLoadingMovie}
                    />
                </div>
                <div className='w-full flex flex-col gap-4 max-[850px]:hidden'>
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
                </div>
            </div>
            <ContactModal/>
        </>
    );
}