import JWT from 'jsonwebtoken';

export const ACCESS_TOKEN_LIFETIME = process.env.NODE_ENV === 'development' ? '1m' : '5m';
export const REFRESH_TOKEN_LIFETIME = process.env.NODE_ENV === 'development' ? '5m' : '3d';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const accessTokenSecret: JWT.Secret = ACCESS_TOKEN_SECRET || '';
export const refreshTokenSecret: JWT.Secret = REFRESH_TOKEN_SECRET || '';
