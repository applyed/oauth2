import express from 'express';
import Session from 'express-session';
import SequelizeSession from 'connect-session-sequelize';
import 'dotenv/config';
import { initDB, sequelize } from './db';
import { loadLoggedInUser } from './middlewares';
import { apiRouter } from './routes';
import './extended-types';
import path, { dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SequelizeStore = SequelizeSession(Session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 3 * 30 * 24 * 60 * 60 * 1000,
  checkExpirationInterval: 15 * 60 * 1000,
});

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../../dist-client');
const distExists = existsSync(distPath);
if (distExists) {
  app.use(express.static(distPath));
}

app.use(
  Session({
    name: '_tsc',
    proxy: true,
    secret: process.env.SESSION_SECRET ?? 'Keyboard cat',
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: 'applyed.in',
      secure: true,
    },
  })
);
app.use(loadLoggedInUser);
app.use(express.json({}));
app.use('/api/v1', apiRouter);

// Server index.html for any other get request;
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT ?? '3000';
app.listen(PORT, async () => {
  console.log('Application started on port', PORT);
  await initDB();
  sessionStore.sync();
  console.log('DB initialized!');
});
