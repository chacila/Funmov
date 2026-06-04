import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import { appDataSource } from './datasource.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import { jsonErrorHandler } from './services/jsonErrorHandler.js';
import { routeNotFoundJsonHandler } from './services/routeNotFoundJsonHandler.js';
import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import ratingsRouter from './routes/ratings.js';

const startServer = async () => {
  console.log('Data Source has been initialized!');
  console.log('DB PATH =', process.env.DATABASE_NAME);
  const app = express();

  const repo = appDataSource.getRepository('User');
  console.log(await repo.query('PRAGMA table_info(user);'));

  app.use(logger('dev'));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));



  // Register routes
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/movies', moviesRouter);
  app.use('/api', ratingsRouter);

  // Register 404 middleware and error handler
  app.use(routeNotFoundJsonHandler); // this middleware must be registered after all routes to handle 404 correctly
  app.use(jsonErrorHandler); // this error handler must be registered after all middleware to catch all errors

  const port = parseInt(process.env.PORT || '8000');

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

// 1. starts only the server
//startServer();

// 2. starts the database connection first then starts the server
appDataSource
  .initialize()
  .then(startServer)
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
