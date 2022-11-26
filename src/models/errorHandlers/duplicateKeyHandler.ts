import mongoose, { Error } from 'mongoose';
import { MongoError } from 'mongodb';

export const duplicateKeyHandler: mongoose.ErrorHandlingMiddlewareFunction = (error, _, next) => {
  if ((error as MongoError).code === 11000 && error.name === 'MongoServerError') {
    next(new Error('An element with the same name already exists'));
  } else {
    next(error);
  }
};
