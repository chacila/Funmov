import { Router } from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';
import Rating from '../entities/rating.js';
import { getRecommendations } from '../reco/pearson.js';

const router = Router();
 

router.post('/ratings', async (req, res) => {
  const { movieId, score, userId } = req.body;
  console.log(req.body)
 
  if (!movieId || score == null) {
    return res.status(400).json({ error: 'movieId et score sont requis.' });
  }

  const parsedScore = parseFloat(score);
  if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 10) {
    return res.status(400).json({ error: 'score doit être entre 1 et 10.' });
  }

  const movieRepo = appDataSource.getRepository(Movie);
  const ratingRepo = appDataSource.getRepository(Rating);

  // Vérifie que le film existe dans la BDD
  const movie = await movieRepo.findOneBy({ tmdb_id: movieId });
  if (!movie) {
    return res.status(404).json({ error: 'Film introuvable.' });
  }

  // Cherche une note existante pour cet utilisateur + ce film
  let rating = await ratingRepo.findOneBy({
    user_id: userId,
    movie_id: movieId,
  });

  if (rating) {
    // Mise à jour
    rating.score = parsedScore;
    await ratingRepo.save(rating);
  } else {
    // Création
    rating = ratingRepo.create({
      user_id: userId,
      movie_id: movieId,
      score: parsedScore,
    });
    await ratingRepo.save(rating);
  }

  return res
    .status(200)
    .json({ message: 'Note enregistrée.', movieId, score: parsedScore });
});

// ----------------------------------------------------------------
//  DELETE /api/ratings/:movieId
//  Supprime la note de l'utilisateur connecté pour un film
// ----------------------------------------------------------------
router.delete('/ratings/:movieId', async (req, res) => {
  const userId = req.user.id;
  const movieId = parseInt(req.params.movieId, 10);

  const ratingRepo = appDataSource.getRepository(Rating);
  const result = await ratingRepo.delete({
    user_id: userId,
    movie_id: movieId,
  });

  if (result.affected === 0) {
    return res.status(404).json({ error: 'Note introuvable.' });
  }

  return res.status(200).json({ message: 'Note supprimée.' });
});

// ----------------------------------------------------------------
//  GET /api/ratings
//  Retourne toutes les notes de l'utilisateur connecté
// ----------------------------------------------------------------
router.get('/ratings', async (req, res) => {
  const userId = req.params.userId;
 
  const ratings = await appDataSource
    .getRepository(Rating)
    .createQueryBuilder('rating')
    .innerJoin('movie', 'movie', 'movie.id = rating.movie_id')
    .select([
      'rating.movie_id  AS movieId',
      'rating.score     AS score',
      'movie.title      AS title',
      'movie.poster_path AS posterPath',
    ])
    .where('rating.user_id = :userId', { userId })
    .orderBy('rating.updated_at', 'DESC')
    .getRawMany();

  return res.status(200).json(ratings);
});

// ----------------------------------------------------------------
//  GET /api/recommendations
//  Retourne les films recommandés pour l'utilisateur connecté
//  Query param optionnel : ?limit=10
// ----------------------------------------------------------------
router.get('/recommendations', async (req, res) => {
  const userId = req.params.userId;
  const limit  = Math.min(parseInt(req.query.limit, 10) || 10, 50);
 
  const ratingRepo = appDataSource.getRepository(Rating);
  const movieRepo = appDataSource.getRepository(Movie);

  // Charge toutes les notes (nécessaire pour Pearson item-item)
  const allRatings = await ratingRepo.find();
  const allMovies = await movieRepo.find();

  if (!allRatings.length || !allMovies.length) {
    return res.status(200).json([]);
  }

  // Vérifie que l'utilisateur a déjà noté au moins un film
  const userHasRatings = allRatings.some((r) => r.user_id === userId);
  if (!userHasRatings) {
    return res.status(200).json({
      message: 'Notez des films pour obtenir des recommandations.',
      recommendations: [],
    });
  }

  // pearson.js attend { user_id, movie_id, score } et { id, title }
  const ratingsForPearson = allRatings.map((r) => ({
    user_id: r.user_id,
    movie_id: r.movie_id,
    score: r.score,
  }));
  const moviesForPearson = allMovies.map((m) => ({
    id: m.id,
    title: m.title,
  }));

  const recommendations = getRecommendations(
    userId,
    ratingsForPearson,
    moviesForPearson,
    limit
  );

  return res.status(200).json(recommendations);
});

export default router;
