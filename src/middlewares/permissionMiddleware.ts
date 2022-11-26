import { NextFunction, Request, Response } from 'express';

import { Chats } from '../models/chats';
import { Users } from '../models/users';
import { CustomResponseError } from '../utils/exceptions';

const permissionDeniedError = new CustomResponseError(403, 'Permission denied');

export const permissionCheck = (
  permission = 'creator',
) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  switch (permission) {
    case 'creator': {
      try {
        const userInfo = req.user;
        const { chatId } = req.params;

        const chat = await Chats.findById(chatId);

        if (chat && chat.creator.toString() === userInfo?.id) {
          next();
        } else {
          next(permissionDeniedError);
        }
      } catch (error) {
        next(error);
      }
      break;
    }
    case 'member': {
      try {
        const userInfo = req.user;
        const { chatId } = req.params;

        const user = await Users.findById(userInfo?.id);
        const isMember = user?.chats.find((chat) => chat.toString() === chatId);

        if (isMember) {
          next();
        } else {
          next(permissionDeniedError);
        }
      } catch (error) {
        next(error);
      }
      break;
    }
    default: {
      next(permissionDeniedError);
    }
  }
};
