import Joi from 'joi';

import { AuthPayload, ChangeNamePayload } from './interfaces';

export const AuthPayloadSchema = Joi.object<AuthPayload>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const ChangeNamePayloadSchema = Joi.object<ChangeNamePayload>({
  newName: Joi.string().required(),
});
