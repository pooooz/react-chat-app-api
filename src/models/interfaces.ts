import { Types } from 'mongoose';

export interface ChatData {
  name: string;
  creator: Types.ObjectId;
}

export interface MessageData {
  chatId: Types.ObjectId;
  author: string;
  text: string;
}

export interface TokenSchema {
  token: string;
  email: string;
  isActual: boolean;
}

export interface UserSchema {
  email: string;
  password: string;
  name: string;
  chats: Array<Types.ObjectId>
}
