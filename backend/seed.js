import axios from 'axios';
import { appDataSource } from './datasource.js';
import Movie from './entities/movie.js';

const TMDB_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';

async function seed() {
  await appDataSource.initialize();

  const repo = appDataSource.getRepository(Movie);

  let allMovies = [];

  for (let page = 1; page <= 5; page++) {
    const res = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
      params: {
        include_adult: false,
        with_genres: 35,
        sort_by: 'popularity.desc',
        page,
      },
    });

    allMovies = [...allMovies, ...res.data.results];
  }

  for (const movie of allMovies) {
    const newMovie = repo.create({
      title: movie.title,
      release_date: movie.release_date,
      overview: movie.overview,
      poster_path: movie.poster_path,
      tmdb_id: movie.id,
      popularity: movie.popularity,
      vote: movie.vote_average,
      vote_count: movie.vote_count,
    });

    await repo.insert(newMovie);
  }

  console.log('Seed terminé');
  process.exit();
}

seed();
