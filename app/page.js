'use client';

import {useState, useEffect} from 'react';
import Swal from 'sweetalert2';
import SearchForm from '../components/SearchForm';
import MovieList from '../components/MovieList';
import MoviePlayer from '../components/MoviePlayer';
import ContactModal from '../components/ContactModal';
import Image from 'next/image';
import bgPhoto from '@/public/bgPhoto.jpeg'

const corsUrl = process.env.NEXT_PUBLIC_CORS_URL;
const kinogoUrl = process.env.NEXT_PUBLIC_KINOGO_URL;
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

    useEffect(() => {
        const fetchTopMovies = async () => {
            setLoading(true);
            try {
                const res = await fetch(corsUrl + kinogoUrl);
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const carouselItems = doc.querySelector('.carousel__items');

                if (carouselItems) {
                    const items = Array.from(carouselItems.children).map((item) => {
                        const titleWithYear = item.title;
                        const img = item.innerHTML;
                        const url = item.href;
                        const regex = /src="([^"]+)"/;
                        const match = img.match(regex);
                        const imageUrl = match ? match[1] : null;
                        const titleYearRegex = /^(.*)\s\((\d{4})\)$/;
                        const matchTitleYear = titleWithYear.match(titleYearRegex);
                        const title = matchTitleYear ? matchTitleYear[1] : titleWithYear;
                        const year = matchTitleYear ? matchTitleYear[2] : null;

                        return {title, year, url, img: imageUrl};
                    });

                    setMovies(items);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'An error occurred while fetching the best movies.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTopMovies();
    }, []);

    useEffect(() => {
        const loadFilmFromLocalStorage = () => {
            const savedNumber = localStorage.getItem('selectedNumber');
            const savedUrl = localStorage.getItem('selectedURL');
            const savedName = localStorage.getItem('selectedName');

            if (savedNumber) {
                setIframeSrc(`${ddbbUrl}?id=${savedNumber}&n=0`);
                fetchTitleAndHLS(savedNumber);
            }
            if (savedUrl && savedName) {
                setIframeSrc(savedUrl);
                setMovieTitle(savedName);
                fetchTitleAndHLS(savedUrl);
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
            localStorage.setItem('selectedNumber', number);
            localStorage.removeItem('selectedURL');
            localStorage.removeItem('selectedName');
            fetchTitleAndHLS(number);
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

    const handleMovieClick = async (movie) => {
        if (movie.dataId) {
            setIframeSrc(`${ddbbUrl}?id=${movie.dataId}&n=0`);
            localStorage.setItem('selectedNumber', movie.dataId);
            localStorage.removeItem('selectedURL');
            localStorage.removeItem('selectedName');
            fetchTitleAndHLS(movie.dataId);
        } else if (movie.url) {
            try {
                const response = await fetch(corsUrl + movie.url);
                const pageHtml = await response.text();
                const pageDoc = new DOMParser().parseFromString(pageHtml, 'text/html');
                const liElement = pageDoc.querySelector('li[data-provider="2"]');
                const trailer = pageDoc.querySelector('.video__trailer');

                if (liElement) {
                    const iframeSrc = liElement.getAttribute('data-src');
                    const trail = trailer?.getAttribute('data-src');
                    setTrailer(trail)
                    if (iframeSrc) {
                        setIframeSrc(iframeSrc);
                        setMovieTitle(movie.title);
                        localStorage.setItem('selectedURL', iframeSrc);
                        localStorage.setItem('selectedName', movie.title);
                        localStorage.removeItem('selectedNumber');
                        fetchTitleAndHLS(iframeSrc);
                    }
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load movie.',
                });
            }
        }
    };

    const fetchTitleAndHLS = async (extractedNumber) => {
        const apiUrl = `${process.env.NEXT_PUBLIC_KINOBOX_API}?kinopoisk=${extractedNumber}&sources=turbo%2Ccollaps%2Calloha%2Cvibix%2Cvideocdn%2Chdvb%2Ckodik`;
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

    const handleCloseFilm = () => {
        localStorage.clear();
        setTrailer('')
        setIframeSrc('');
        setMovieTitle('');
        setDownloadUrl('');
    };

    return (
        <>
            {/* Ֆոնային նկար */}
            <Image
                src={bgPhoto}
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
                        />
                    </div>
                    <MovieList
                        movies={movies}
                        title={title}
                        loading={loading}
                        onMovieClick={handleMovieClick}
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
                    />
                </div>
            </div>
            <ContactModal/>
        </>
    );
}