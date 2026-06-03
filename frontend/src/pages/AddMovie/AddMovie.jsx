import { useState } from 'react';
import axios from 'axios';

function AddMovie() {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:8000/movies/new', {
        title,
        release_date: releaseDate,
      })
      .then(() => {
        setTitle('');
        setReleaseDate('');
        alert('Film ajouté 🍿');
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="add-movie">
      <h1>Ajouter un film 🍿</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />

        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AddMovie;
