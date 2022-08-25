import mongoose from 'mongoose';

import { duplicateKeyHandler } from './errorHandlers/duplicateKeyHandler.js';

const { Schema, model } = mongoose;

const ChatSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
}, {
  timestamps: true,
});

ChatSchema.post('save', duplicateKeyHandler);
ChatSchema.post('update', duplicateKeyHandler);
ChatSchema.post('findOneAndUpdate', duplicateKeyHandler);
ChatSchema.post('insertMany', duplicateKeyHandler);

export const Chats = model('Chats', ChatSchema, 'Chats');
