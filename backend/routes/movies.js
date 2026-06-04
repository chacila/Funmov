import express from 'express';
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

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);

  const newMovie = movieRepository.create({
    title: req.body.title,
    release_date: req.body.release_date,
  });

  movieRepository
    .insert(newMovie)
    .then(() => {
      res.status(201).json({ message: 'Movie created' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error creating movie' });
    });
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

//router.get('/find', async function (req, res) {
//  const movieRepository = appDataSource.getRepository(Movie);
//
//const sort = req.query.sort || 'notes';
//  const order = req.query.order || 'DESC';

//const allowedFields = ['title', 'release_date', 'notes', 'duration'];

//const sortField = allowedFields.includes(sort) ? sort : 'notes';

//const movies = await movieRepository
//.createQueryBuilder('movie')
//  .orderBy(`movie.${sortField}`, order.toUpperCase())
//.addOrderBy('movie.title', 'ASC')
//.getMany();

// res.json({ movies });
//});

export default router;
