import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',

  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    tmdb_id: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
    },
    release_date: {
      type: String,
    },
    overview: {
      type: String,
    },
    poster_path: {
      type: String,
    },
  },

  relations: {
    ratings: {
      type: 'one-to-many',
      target: 'UserMovie',
      inverseSide: 'movie',
    },
  },
});

export default Movie;
