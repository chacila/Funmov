import { useState } from 'react';
import api from '../../services/axios';

function AddMovie() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);

      const res = await api.get('/movies/search', {
        params: {
          query,
        },
      });

      setResults(res.data);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async (movie) => {
    try {
      await api.post('/movies/new', {
        tmdb_id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        overview: movie.overview,
        poster_path: movie.poster_path,
      });

      alert(`"${movie.title}" ajouté avec succès !`);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Erreur lors de l'ajout du film");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Ajouter un film</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            marginRight: '10px',
          }}
        />

        <button onClick={searchMovies}>Rechercher</button>
      </div>

      {loading && <p>Recherche en cours...</p>}

      <div>
        {results.map((movie) => (
          <div
            key={movie.id}
            style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '20px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: '120px',
                  borderRadius: '8px',
                }}
              />
            )}

            <div>
              <h2>{movie.title}</h2>

              <p>
                <strong>Date :</strong> {movie.release_date}
              </p>

              <p>
                {movie.overview
                  ? movie.overview.substring(0, 250) + '...'
                  : 'Aucun résumé disponible'}
              </p>

              <button onClick={() => addMovie(movie)}>Ajouter à la base</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddMovie;
