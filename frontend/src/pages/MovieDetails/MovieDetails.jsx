import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p style={{ color: 'white' }}>Chargement...</p>;
  }
  if (!movie) {
    return <p style={{ color: 'white' }}>Film introuvable</p>;
  }

  return (
    <div className="movie-details">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />

      <div className="movie-info">
        <h1 className="movie-title">{movie.title}</h1>

        <p className="movie-meta">🎬 Sortie : {movie.release_date}</p>

        <p className="movie-overview">{movie.overview}</p>
      </div>
    </div>
  );
}

export default MovieDetails;
