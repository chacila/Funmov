import express from 'express';
import axios from 'axios';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';

const router = express.Router();

router.get('/', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);

  movieRepository
    .find()
    .then(function (movies) {
      res.status(200).json({ movies });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error while fetching movies',
      });
    });
});

router.post('/new', async (req, res) => {
  try {
    const movieRepository = appDataSource.getRepository(Movie);

    const {
      tmdb_id,
      title,
      release_date,
      overview,
      poster_path,
      popularity,
      vote,
      vote_count,
    } = req.body;

    const existingMovie = await movieRepository.findOneBy({
      tmdb_id,
    });

    if (existingMovie) {
      return res.status(400).json({
        message: 'Film déjà présent dans la base',
      });
    }

    const movie = movieRepository.create({
      tmdb_id,
      title,
      release_date,
      overview,
      poster_path,
      popularity,
      vote,
      vote_count,
    });

    await movieRepository.save(movie);

    res.status(201).json({
      message: 'Film ajouté',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de l'ajout",
    });
  }
});

router.get('/search', async (req, res) => {
  try {
    console.log('TMDB TOKEN =', process.env.TMDB_TOKEN);
    const { query } = req.query;

    const response = await axios.get(
      'https://api.themoviedb.org/3/search/movie',
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          accept: 'application/json',
        },
        params: {
          query,
        },
      }
    );

    res.json(response.data.results);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erreur TMDB',
    });
  }
});

router.get('/:id', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);

  const tmdbId = Number(req.params.id);

  movieRepository
    .findOneBy({ tmdb_id: tmdbId })
    .then(function (movie) {
      if (!movie) {
        return res.status(404).json({
          message: 'Movie not found',
        });
      }

      res.status(200).json(movie);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error while fetching movie',
      });
    });
});

router.delete('/:id', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);

  const movieId = Number(req.params.id);

  movieRepository
    .delete({ id: movieId })
    .then(function (result) {
      if (result.affected === 0) {
        return res.status(404).json({
          message: 'Movie not found',
        });
      }

      res.status(200).json({
        message: 'Movie successfully deleted',
      });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error while deleting movie',
      });
    });
});

export default router;
