import { Strategy as JWTStrategy } from 'passport-jwt';
import { Request } from 'express';

import { Users } from '../models/users';

const { ACCESS_TOKEN_SECRET } = process.env;

const cookieExtractor = (req: Request) => {
  if (req.cookies) {
    return req.cookies.accessToken;
  }
  return null;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: ACCESS_TOKEN_SECRET,
};

export const authStrategy = new JWTStrategy(options, async (jwtPayload, done) => {
  try {
    const user = await Users.findById(jwtPayload.id);
    if (user) {
      const { id, name, email } = user;
      return done(null, { id, name, email });
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});
