import mongoose from 'mongoose';

import { duplicateKeyHandler } from './errorHandlers/duplicateKeyHandler.js';

const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  chatId: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

MessageSchema.post('save', duplicateKeyHandler);
MessageSchema.post('update', duplicateKeyHandler);
MessageSchema.post('findOneAndUpdate', duplicateKeyHandler);
MessageSchema.post('insertMany', duplicateKeyHandler);

export const Messages = model('Messages', MessageSchema, 'Messages');
