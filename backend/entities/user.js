import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'User',

  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },

    email: {
      type: String,
      unique: true,
    },

    username: {
      type: String,
      unique: false,
    },

    password: {
      type: String,
    },
  },

  relations: {
    ratings: {
      type: 'one-to-many',
      target: 'Rating',
      inverseSide: 'user',
    },
  },
});

export default User;
