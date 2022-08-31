export const duplicateKeyHandler = (error, _, next) => {
  if (error.code === 11000 && error.name === 'MongoServerError') {
    next(new Error('An element with the same name already exists'));
  } else {
    next(error);
  }
};
