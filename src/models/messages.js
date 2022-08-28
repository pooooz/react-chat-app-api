import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chats',
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

export const Messages = model('Messages', MessageSchema, 'Messages');
