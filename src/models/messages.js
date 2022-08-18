import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messageSchema = new Schema({
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
});

export const Messages = model('Messages', messageSchema, 'Messages');
