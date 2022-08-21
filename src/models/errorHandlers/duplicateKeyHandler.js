export const duplicateKeyHandler = (error, _, next) => {
  if (error.code === 11000 && error.name === 'MongoServerError') {
    next(new Error('A chat with this name already exists'));
  } else {
    next(error);
  }
};
