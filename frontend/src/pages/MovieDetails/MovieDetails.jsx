import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(null);
  const displayed = hovered ?? value;

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <span
          key={star}
          className={`star ${displayed >= star ? 'filled' : ''}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
      {value && <span className="rating-label">{value}/10</span>}
    </div>
  );
}

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userScore, setUserScore] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);


  useEffect(() => {
    axios
      .get(`http://localhost:8000/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);


  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/ratings`)
      .then((res) => {
        const existing = res.data.find((r) => String(r.movieId) === String(id));
        if (existing) setUserScore(existing.score);
      })
      .catch(() => {}); // pas encore authentifié, on ignore
  }, [id]);

  const handleRate = async (score) => {
    setUserScore(score);
    setSaving(true);
    setMessage(null);
    try {
      await axios.post('http://localhost:8000/api/ratings', {
        movieId: parseInt(id),
        score,
      });
      setMessage('Note enregistrée ✓');
    } catch {
      setMessage('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: 'white' }}>Chargement...</p>;
  if (!movie)  return <p style={{ color: 'white' }}>Film introuvable</p>;

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

        <div className="rating-section">
          <p className="rating-prompt">
            {userScore ? 'Votre note :' : 'Notez ce film :'}
          </p>
          <StarRating value={userScore} onChange={handleRate} />
          {saving && <p className="rating-status">Enregistrement...</p>}
          {message && <p className="rating-status">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;