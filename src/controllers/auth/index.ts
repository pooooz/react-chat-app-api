import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import {
  NextFunction, Request, Response,
} from 'express';

import {
  ACCESS_TOKEN_LIFETIME, accessTokenSecret, REFRESH_TOKEN_LIFETIME, refreshTokenSecret,
} from './constants';

import { Users } from '../../models/users';
import { Tokens } from '../../models/tokens';
import { convertLifetimeStringToMilliseconds } from '../../utils';
import { CustomResponseError } from '../../utils/exceptions';

const badCreditsError = new CustomResponseError(400, 'Email or password is wrong');

class Auth {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await Users.create(req.body);
      const { _id, email } = newUser;

      res.status(201).send({ id: _id, email });
    } catch (error) {
      next(error);
    }
  }

  async logIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });

      if (!user) {
        next(badCreditsError);
        return;
      }

      const compare = await bcrypt.compare(password, user.password);

      if (!compare) {
        next(badCreditsError);
        return;
      }

      const data = {
        id: user._id,
        email: user.email,
        name: user.name,
      };

      const accessToken = JWT.sign(
        data,
        accessTokenSecret,
        { expiresIn: ACCESS_TOKEN_LIFETIME },
      );

      const refreshToken = JWT.sign(
        data,
        refreshTokenSecret,
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

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;

    try {
      if (refreshToken) {
        const dataObject: CustomJWTPayload | string = JWT.verify(refreshToken, refreshTokenSecret);

        const actualToken = await Tokens.findOne({ token: refreshToken, isActual: true });

        if (actualToken && typeof dataObject !== 'string') {
          const { id, email } = dataObject;
          const accessToken = JWT.sign(
            { id, email },
            accessTokenSecret,
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
          next(new CustomResponseError(401, 'Unauthorized access'));
        }
      } else {
        next(new CustomResponseError(401, 'Token not provided'));
      }
    } catch (error) {
      await Tokens.findOne({ token: refreshToken, isActual: true }).update({ isActual: false });
      next(error);
    }
  }
}

export const AuthController = new Auth();
