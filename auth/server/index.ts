import express from 'express';
import Session from 'express-session';
import SequelizeSession from 'connect-session-sequelize';
import 'dotenv/config';
import { initDB, sequelize } from './db';
import { loadLoggedInUser } from './middlewares';
import { apiRouter } from './routes';
import './extended-types';

const SequelizeStore = SequelizeSession(Session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 3 * 30 * 24 * 60 * 60 * 1000,
  checkExpirationInterval: 15 * 60 * 1000,
});

const app = express();

app.use(
  Session({
    secret: process.env.SESSION_SECRET ?? 'Keyboard cat',
    store: sessionStore,
  })
);
app.use(loadLoggedInUser);
app.use(express.json({}));
app.use('/api/v1', apiRouter);

const PORT = process.env.PORT ?? '8020';
app.listen(PORT, async () => {
  console.log('Application started!');
  await initDB();
  sessionStore.sync();
  console.log('DB initialized!');
});
