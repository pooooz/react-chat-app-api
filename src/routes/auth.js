import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Users } from '../models/users.js';
import { Tokens } from '../models/tokens.js';

const router = express.Router();

const accessTokenLifetime = '1m';
const refreshTokenLifetime = '1d';

router.post('/signup', async (req, res, next) => {
  try {
    const newUser = await Users.create(req.body);
    const { _id, email } = newUser;
    res.status(201);
    res.send({ id: _id, email });
  } catch (error) {
    next(error);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    res.status(400);
    res.json({ message: 'User or password is wrong' });
    return;
  }
  const compare = await bcrypt.compare(password, user.password);

  if (!compare) {
    res.status(400);
    res.json({ message: 'User or password is wrong' });
    return;
  }

  const data = {
    id: user._id,
    email: user.email,
  };

  const accessToken = jwt.sign(
    data,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenLifetime },
  );

  const refreshToken = jwt.sign(
    data,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenLifetime },
  );

  await Tokens.findOne({ email: user.email }).update({ isActual: false });
  try {
    await Tokens.create({ token: refreshToken, email: user.email });
    res.status(200);
    res.json({
      accessToken, refreshToken, username: user.username, userId: user._id,
    });
  } catch (error) {
    res.status(500);
    res.json({ error: true, message: 'Refresh token was not created' });
  }
});

router.post('/token', async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const decode = jwt.decode(refreshToken);
    const actualToken = await Tokens.findOne({ token: refreshToken, isActual: true });

    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      await Tokens.findOne({ token: refreshToken, isActual: true }).update({ isActual: false });
      res
        .status(401)
        .json({ error: true, message: 'Unauthorized access' });
      return;
    }

    if (actualToken) {
      try {
        const accessToken = jwt.sign(
          { id: decode.id, email: decode.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: accessTokenLifetime },
        );
        res.status(200);
        res.json({ accessToken, isActual: true });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(401);
      res.json({ error: true, message: 'Unauthorized access' });
    }
  } else {
    res.status(400);
    res.json({ error: true, message: 'Token not provided' });
  }
});

export default router;
