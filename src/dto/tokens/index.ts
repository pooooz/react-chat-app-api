import Joi from 'joi';

import { RefreshPayload } from './interfaces';

export const RefreshPayloadSchema = Joi.object<RefreshPayload>({
  refreshToken: Joi.string().required(),
}).unknown();
