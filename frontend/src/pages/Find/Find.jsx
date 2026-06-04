import { useMemo, useState } from 'react';
import { useFetchMoviesLocal } from '../../pages/Home/useFetchMovies';
import Movie from '../../components/Movie/Movie.jsx';
import './Find.css';

function Find() {
  //const [title, setTitle] = useState('');
  //const [releaseDate, setReleaseDate] = useState('');

  const [isLoading, setisLoading] = useState(false);

  const [sortField, setSortField] = useState('vote');
  const [sortOrder, setSortOrder] = useState('desc');

  const [appliedField, setAppliedField] = useState('vote');
  const [appliedOrder, setAppliedOrder] = useState('desc');
  const hasChanges = sortField !== appliedField || sortOrder !== appliedOrder;

  const { movieName, setMovieName, movies } = useFetchMoviesLocal();

  const handleApply = async () => {
    setisLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAppliedField(sortField);
    setAppliedOrder(sortOrder);

    setisLoading(false);
  };

  const sortedMovies = useMemo(() => {
    const filtered = movieName
      ? movies.filter((movie) =>
          movie.title.toLowerCase().includes(movieName.toLowerCase())
        )
      : [...movies];

    return filtered.sort((a, b) => {
      let valueA;
      let valueB;

      switch (appliedField) {
        case 'title':
          valueA = a.title;
          valueB = b.title;
          break;

        case 'release_date':
          valueA = new Date(a.release_date);
          valueB = new Date(b.release_date);
          break;

        case 'vote':
          valueA = a.vote ?? 0;
          valueB = b.vote ?? 0;
          break;

        case 'popularity':
          valueA = a.popularity ?? 0;
          valueB = b.popularity ?? 0;
          break;

        case 'comments':
          valueA = a.comments?.length ?? 0;
          valueB = b.comments?.length ?? 0;
          break;

        case 'vote_count':
          valueA = a.vote_count ?? 0;
          valueB = b.vote_count ?? 0;
          break;

        default:
          valueA = a.vote ?? 0;
          valueB = b.vote ?? 0;
      }

      let result;

      if (typeof valueA === 'string') {
        result = valueA.localeCompare(valueB);
      } else {
        result = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      }

      if (appliedOrder === 'desc') {
        result *= -1;
      }

      if (result === 0) {
        return a.title.localeCompare(b.title);
      }

      return result;
    });
  }, [movies, movieName, appliedField, appliedOrder]);

  console.log(movies);

  return (
    <div className="App">
      <div className="filter-panel">
        <div className="filter-group">
          <label>
            Critère
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="vote">Note /10</option>
              <option value="vote_count">Nombre de notes</option>
              <option value="popularity">Popularité</option>
              <option value="comments">Commentaires</option>
              <option value="title">Titre</option>
              <option value="release_date">Date de sortie</option>
            </select>
          </label>
        </div>

        <div className="filter-group">
          <label>
            Ordre
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Croissant</option>
              <option value="desc">Décroissant</option>
            </select>
          </label>
        </div>

        <button
          className="apply-filter-button"
          onClick={handleApply}
          disabled={!hasChanges}
        >
          Appliquer
        </button>
      </div>

      {isLoading ? (
        <div className="loader-container">
          <div className="loader-smiley">😀</div>
        </div>
      ) : (
        <ul className="movie-grid">
          {sortedMovies.map((movie) => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Find;
