import { Router } from 'express';
import { ThemePreferencesEnum, User } from '../models/user';
import bcrypt from 'bcryptjs';
import { isAllowed } from './roles';
import { allowSignup, parseDestination } from './utils';

export const apiRouter = Router();

apiRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      success: false,
      error: 'MISSING_REQUIRED_PARAMS',
    });
    return;
  }

  const user = (
    await Promise.all([
      User.findOne({
        where: {
          username,
        },
      }),
      User.findOne({
        where: {
          email: username,
        },
      }),
    ])
  ).find(Boolean);

  if (
    !user ||
    !user.password ||
    !(await bcrypt.compare(password, user.password))
  ) {
    res.status(400).json({
      success: false,
      error: 'USER_NOT_FOUND',
    });
    return;
  }

  req.session.loggedinUserId = user.id;

  res.json({
    success: true,
  });
});

apiRouter.get('/check-username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.query.username?.toString() ?? '',
    },
  });

  res.json({
    available: user === null,
  });
});

apiRouter.get('/auth', (req, res) => {
  const destination = parseDestination(req);
  const destinationURI = destination.uri ?? destination.host;

  if (!destinationURI) {
    res.status(403).end('Unknown destination!');
    return;
  }

  const loggedInUser = req.user;
  if (!loggedInUser) {
    res.redirect(
      `/login?returnURI=${encodeURIComponent(destinationURI.toString())}`
    );
    return;
  }

  if (!isAllowed(destinationURI, loggedInUser)) {
    res.status(403).end('Forbidden');
    return;
  }

  res.status(200).end('Ok');
});

apiRouter.post('/signup', async (req, res) => {
  if (!allowSignup(req)) {
    res.status(404).end('Not Found');
    return;
  }

  if (!req.body.email || !req.body.name) {
    res.status(400).json({
      success: false,
      error: 'MISSING_REQUIRED_PARAMS',
    });
    return;
  }

  try {
    await User.create({
      email: req.body.email,
      name: req.body.name,
      roles: req.body.roles ?? [],
      themePreference: req.body.themePreference ?? ThemePreferencesEnum.LIGHT,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)),
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: (e as Error).message,
    });
    return;
  }

  res.json({
    success: true,
  });
});

apiRouter.get('/app-state', async (req, res) => {
  const firstUser = await User.findOne();
  res.json({
    isSettingUp: firstUser === null,
  });
});
