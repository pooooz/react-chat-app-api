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
  name: {
    type: String,
    required: true,
    default: 'Basic User',
  },
  chats: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Chats' }],
    required: true,
    default: [],
  },
});

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.post('save', duplicateKeyHandler);
UserSchema.post('update', duplicateKeyHandler);
UserSchema.post('findOneAndUpdate', duplicateKeyHandler);
UserSchema.post('insertMany', duplicateKeyHandler);

export const Users = model('Users', UserSchema, 'Users');
