import { useEffect, useState } from 'react'
import Search from './components/search'
import Spinner from './components/spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingErrorMessage, setTrendingErrorMessage] = useState('');
  const [trendingIsLoading, setTrendingIsLoading] = useState(false);


  //Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fecthMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (!data.results) {
        setErrorMessage(data.error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {

        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fecthing movies: ${error}`);
      setErrorMessage('Error fecthing movies. Please try again later.');
    } finally {
      setIsLoading(false);

    }
  }

  const loadTrendingMovies = async () => {
    try {
      setTrendingIsLoading(true);
      setTrendingErrorMessage('');


      const movies = await getTrendingMovies();
      setTrendingMovies(movies.documents || []);
    } catch (error) {
      console.error(`Error trending movies: ${error}`);
      setTrendingErrorMessage('Error fecthing trending movies. Please try again later');
    } finally {
      setTrendingIsLoading(false);
    }
  }

  useEffect(() => {
    fecthMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);


  return (
    <div>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner' />
          <h1> Find <span className='text-gradient'> Movies </span> You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending' >
            <h2>Trending Movies</h2>

            {trendingIsLoading ? (
              <div className='mt-7 mb-7' >  <Spinner /> </div>

            ) : trendingErrorMessage ? (
              <p className='text-red-500 mt-7 mb-7'>{trendingErrorMessage}</p>
            ) : (
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>

                    <img src={movie.poster_url} alt={movie.title} />

                  </li>
                ))}
              </ul>
            )}


          </section>
        )}

        <section className='all-movies' >
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movieFull={movie} moviePreview={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default App