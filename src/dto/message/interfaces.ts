import { Types } from 'mongoose';

export interface CreateMessagePayload {
  chatId: Types.ObjectId,
  author: string;
  text: string;
}

export interface UpdateMessagePayload extends Omit<Partial<CreateMessagePayload>, 'chatId'> {}
