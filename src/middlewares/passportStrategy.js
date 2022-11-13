import { Strategy as JWTStrategy } from 'passport-jwt';
import { Users } from '../models/users.js';

const { ACCESS_TOKEN_SECRET } = process.env;

const cookieExtractor = (req) => {
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
