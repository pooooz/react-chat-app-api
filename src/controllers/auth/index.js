import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from './constants.js';

import { Users } from '../../models/users.js';
import { Tokens } from '../../models/tokens.js';

import { convertLifetimeStringToMilliseconds } from '../../utils/index.js';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

class Auth {
  async signUp(req, res, next) {
    try {
      const newUser = await Users.create(req.body);
      const { _id, email } = newUser;

      res.status(201);
      res.send({ id: _id, email });
    } catch (error) {
      next(error);
    }
  }

  async logIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });

      if (!user) {
        next({ status: 400, message: 'Email or password is wrong' });
        return;
      }

      const compare = await bcrypt.compare(password, user.password);

      if (!compare) {
        next({ status: 400, message: 'Email or password is wrong' });
        return;
      }

      const data = {
        id: user._id,
        email: user.email,
        name: user.name,
      };

      const accessToken = JWT.sign(
        data,
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_LIFETIME },
      );

      const refreshToken = JWT.sign(
        data,
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_LIFETIME },
      );

      await Tokens
        .findOneAndUpdate({ email: user.email, isActual: true }, { $set: { isActual: false } });

      await Tokens.create({ token: refreshToken, email: user.email });

      res
        .status(200)
        .cookie('accessToken', accessToken, {
          maxAge: convertLifetimeStringToMilliseconds(ACCESS_TOKEN_LIFETIME),
          secure: true,
        })
        .cookie('refreshToken', refreshToken, {
          maxAge: convertLifetimeStringToMilliseconds(REFRESH_TOKEN_LIFETIME),
          secure: true,
        })
        .json({
          accessToken, refreshToken, name: user.name, id: user._id,
        });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    const { refreshToken } = req.cookies;

    try {
      if (refreshToken) {
        const dataObject = JWT.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const actualToken = await Tokens.findOne({ token: refreshToken, isActual: true });

        if (actualToken) {
          const { id, email } = dataObject;
          const accessToken = JWT.sign(
            { id, email },
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_LIFETIME },
          );

          res
            .status(200)
            .cookie('accessToken', accessToken, {
              maxAge: convertLifetimeStringToMilliseconds(ACCESS_TOKEN_LIFETIME),
              secure: true,
            })
            .json({ accessToken, refreshToken });
        } else {
          next({ status: 401, message: 'Unauthorized access' });
        }
      } else {
        next({ status: 401, message: 'Token not provided' });
      }
    } catch (error) {
      await Tokens.findOne({ token: refreshToken, isActual: true }).update({ isActual: false });
      next(error);
    }
  }
}

export const AuthController = new Auth();
