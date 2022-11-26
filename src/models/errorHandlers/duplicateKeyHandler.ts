import mongoose from 'mongoose';
import { MongoError } from 'mongodb';

import { CustomResponseError } from '../../utils/exceptions';

export const duplicateKeyHandler: mongoose.ErrorHandlingMiddlewareFunction = (error, _, next) => {
  if ((error as MongoError).code === 11000 && error.name === 'MongoServerError') {
    next(new CustomResponseError(400, 'A user with the same email already exists'));
  } else {
    next(error);
  }
};
