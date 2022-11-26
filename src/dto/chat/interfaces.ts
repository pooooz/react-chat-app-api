import { Types } from 'mongoose';

export interface ChatPayload {
  name: string;
  creator: Types.ObjectId;
}

export interface AddMemberPayload {
  id: Types.ObjectId;
}
