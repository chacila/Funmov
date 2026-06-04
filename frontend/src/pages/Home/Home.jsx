import axios from 'axios';
import { useState } from 'react';
import { useFetchMoviesLocal } from './useFetchMovies';
import Movie from '../../components/Movie/Movie.jsx';
import './Home.css';

function Home() {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  const { movieName, setMovieName, movies, page, loadMoreMovies } =
    useFetchMoviesLocal();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:8000/movies/new', {
        title: title,
        release_date: releaseDate,
      })
      .then(() => {
        setTitle('');
        setReleaseDate('');

        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <div className="search-bar">
        <span className="search-icon">🎬</span>

        <input
          type="text"
          placeholder="Rechercher une comédie, ex: Superbad..."
          value={movieName}
          onChange={(event) => setMovieName(event.target.value)}
          className="search-input"
        />
      </div>
      <ul className="movie-grid">
        {(movieName
          ? movies.filter((movie) =>
              movie.title.toLowerCase().includes(movieName.toLowerCase())
            )
          : movies
        ).map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </ul>

      {page < 5 && (
        <button onClick={loadMoreMovies} className="load-more-button">
          Afficher 20 films de plus
        </button>
      )}
    </div>
  );
}

export default Home;
