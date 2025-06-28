import React from 'react'
import { useLocation } from 'react-router-dom'
import ReturnButton from '../components/ReturnButton';


const MovieDetail = () => {
    const location = useLocation();
    const { movie } = location.state;
    console.log(movie);

    const title = movie.title;
    const posterPath = movie.poster_path || '';
    const overview = movie.overview;
    const vote_average = movie.vote_average;
    const original_language = movie.original_language;
    const release_date = movie.release_date;

    // original languaje
    //popularity
    //relase date
    //vote average  


    return (
        <div >
            <div className='pattern' />
            <div className='wrapper'>
                <ReturnButton />
                <section className='movie-detail'>
                    <div className='content'>
                        <img src={posterPath ? `https://image.tmdb.org/t/p/w500/${posterPath}` : `/no-movie.png`} alt={title} />

                        <div className='details'>
                            <h1>{title}</h1>
                            <div className='extraInfo'>
                                <div className="left rating">
                                    <img src='star.svg' alt='start icon' />
                                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                                </div>

                                <div className="right content">
                                    <p className='lang'>{original_language}</p>
                                    <span>•</span>
                                    <p className='year'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                                </div>
                            </div>
                            <p>{overview} </p>

                        </div>
                    </div>
                </section>
            </div>
        </div >
    )
}

export default MovieDetail