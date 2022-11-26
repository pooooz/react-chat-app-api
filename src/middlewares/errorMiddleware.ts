import JWT from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';

import { CustomResponseError } from '../utils/exceptions';

/* eslint no-unused-vars: 0 */
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ValidationError) {
    res.status(400).json(err.details[0]);
    return;
  }

  if (err instanceof ReferenceError) {
    res.status(400).json(err.message);
    return;
  }

  if (err instanceof JWT.TokenExpiredError) {
    res.status(401).json(err);
    return;
  }

  if (err instanceof JWT.JsonWebTokenError) {
    res.status(401).json(err);
    return;
  }

  if (err instanceof CustomResponseError) {
    res.status(err.status).json(err);
    return;
  }

  res.status(err?.status || 500).json(err);
};
