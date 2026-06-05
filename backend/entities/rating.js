import typeorm from 'typeorm';
 
const Rating = new typeorm.EntitySchema({
  name: 'Rating',
  tableName: 'ratings',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    user_id: {
      type: Number,
    },
    movie_id: {
      type: Number,
    },
    score: {
      type: Number, 
    },
    created_at: {
      type: Date,
      createDate: true,
    },
    updated_at: {
      type: Date,
      updateDate: true,
    },
  },
  uniques: [
    {
      // Un utilisateur ne peut noter un film qu'une seule fois
      columns: ['user_id', 'movie_id'],
    },
  ],
  indices: [
    { columns: ['user_id'] },
    { columns: ['movie_id'] },
  ],
});
 
export default Rating;