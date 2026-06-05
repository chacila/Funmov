import { appDataSource } from './datasource.js';
import User from './entities/user.js';
import Movie from './entities/movie.js';
import Rating from './entities/rating.js';

async function seed() {
  await appDataSource.initialize();

  const userRepo = appDataSource.getRepository(User);
  const movieRepo = appDataSource.getRepository(Movie);
  const ratingRepo = appDataSource.getRepository(Rating);

  console.log('Clearing old ratings...');
  await ratingRepo.clear();

  console.log('Clearing old users...');
  await userRepo.clear();

  // ⚠️ on ne touche PAS aux movies (déjà seed TMDB)
  const movies = await movieRepo.find();

  if (movies.length === 0) {
    console.log('No movies found. Run movie seed first.');
    process.exit(1);
  }

  console.log(`Found ${movies.length} movies`);

  // -----------------------------
  // 1. CREATE USERS
  // -----------------------------
  const usersData = [
    { email: 'alice@test.com', username: 'alice', password: 'test' },
    { email: 'bob@test.com', username: 'bob', password: 'test' },
    { email: 'charlie@test.com', username: 'charlie', password: 'test' },
    { email: 'david@test.com', username: 'david', password: 'test' },
    { email: 'eva@test.com', username: 'eva', password: 'test' },
  ];

  const users = [];

  for (const u of usersData) {
    const user = userRepo.create(u);
    users.push(await userRepo.save(user));
  }

  console.log(`${users.length} users created`);

  // -----------------------------
  // 2. GENERATE RATINGS
  // -----------------------------
  console.log('Generating ratings...');

  const ratings = [];

  for (const user of users) {
    // chaque user note ~20 films random
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    const sample = shuffled.slice(0, 20);

    for (const movie of sample) {
      const score = Math.floor(Math.random() * 5) + 1; // 1 → 5

      const rating = ratingRepo.create({
        user,
        movie,
        score,
      });

      ratings.push(rating);
    }
  }

  await ratingRepo.save(ratings);

  console.log(`Created ${ratings.length} ratings`);
  console.log('Seed finished 🚀');

  process.exit(0);
}

seed();
