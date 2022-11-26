import mongoose from 'mongoose';

import { ChatData } from './interfaces';

const { Schema, model } = mongoose;

const ChatSchema = new Schema<ChatData>({
  name: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
}, {
  timestamps: true,
});

export const Chats = model('Chats', ChatSchema, 'Chats');
