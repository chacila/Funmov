import './Movie.css';
import { Link } from 'react-router-dom';

function Movie({ movie }) {
  return (
    <li className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <div className="movie-image-wrapper">
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
          />

          <div className="movie-overlay">
            <p className="movie-overlay-title">{movie.title}</p>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default Movie;
