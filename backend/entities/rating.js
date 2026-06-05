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

  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      onDelete: 'CASCADE',
    },

    movie: {
      type: 'many-to-one',
      target: 'Movie',
      onDelete: 'CASCADE',
    },
  },

  uniques: [
    {
      columns: ['user', 'movie'],
    },
  ],

  indices: [
    {
      columns: ['user'],
    },
    {
      columns: ['movie'],
    },
  ],
});

export default Rating;
