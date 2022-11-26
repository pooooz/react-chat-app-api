import { NextFunction, Request, Response } from 'express';

import { Chats } from '../models/chats';
import { Users } from '../models/users';
import { CustomResponseError } from '../utils/exceptions';

const permissionDeniedError = new CustomResponseError(403, 'Permission denied');

type Permissions = 'chatCreator' | 'chatMember' | 'isAccountOwner';

export const permissionCheck = (
  permission: Permissions = 'chatCreator',
) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  switch (permission) {
    case 'isAccountOwner': {
      try {
        if (req.params.userId === req.user?.id) {
          next();
        } else {
          next(permissionDeniedError);
        }
      } catch (error) {
        next(error);
      }
      break;
    }
    case 'chatCreator': {
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
    case 'chatMember': {
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
