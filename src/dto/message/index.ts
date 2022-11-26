import Joi from 'joi';

import { CreateMessagePayload, UpdateMessagePayload } from './interfaces';

export const CreateMessagePayloadSchema = Joi.object<CreateMessagePayload>({
  chatId: Joi.string().required(),
  author: Joi.string().required(),
  text: Joi.string().required(),
});

export const UpdateMessagePayloadSchema = Joi.object<UpdateMessagePayload>({
  author: Joi.string(),
  text: Joi.string(),
});
