import JWT from 'jsonwebtoken';

/* eslint no-unused-vars: 0 */
export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof JWT.TokenExpiredError) {
    res.status(401).json(err);
    return;
  }

  if (err instanceof JWT.JsonWebTokenError) {
    res.status(401).json(err);
    return;
  }

  const undefinedError = {
    type: err.type || 'error',
    message: err.message || 'An unexpected error has occurred',
    detail: err.detail || 'No details',
  };

  res.status(err.status || 500).json(undefinedError);
};
