import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { duplicateKeyHandler } from './errorHandlers/duplicateKeyHandler.js';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    default: 'Basic User',
  },
});

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.post('save', duplicateKeyHandler);
UserSchema.post('update', duplicateKeyHandler);
UserSchema.post('findOneAndUpdate', duplicateKeyHandler);
UserSchema.post('insertMany', duplicateKeyHandler);

export const Users = model('Users', UserSchema, 'Users');
