import Joi from 'joi';

import { AddMemberPayload, ChatPayload } from './interfaces';

export const CreateChatPayloadSchema = Joi.object<ChatPayload>({
  name: Joi.string().required(),
  creator: Joi.string().required(),
});

export const AddMemberPayloadSchema = Joi.object<AddMemberPayload>({
  id: Joi.string().required(),
});
