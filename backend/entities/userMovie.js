import typeorm from 'typeorm';

const UserMovie = new typeorm.EntitySchema({
  name: 'UserMovie',

  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },

    rating: {
      type: Number,
      nullable: true,
    },
  },

  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      onDelete: 'CASCADE',
    },

    movie: {
      type: 'many-to-one',
      target: 'Movie',
      joinColumn: true,
      onDelete: 'CASCADE',
    },
  },
});

export default UserMovie;
