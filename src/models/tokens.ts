import mongoose from 'mongoose';

import { TokenSchema } from './interfaces';

const { Schema, model } = mongoose;

const TokenSchema = new Schema<TokenSchema>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    isActual: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Tokens = model('Tokens', TokenSchema, 'Tokens');
