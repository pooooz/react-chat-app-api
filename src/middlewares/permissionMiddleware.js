import { Chats } from '../models/chats.js';
import { Users } from '../models/users.js';

export const permissionCheck = (permission = 'creator') => async (req, res, next) => {
  switch (permission) {
    case 'creator': {
      try {
        const userInfo = req.user;
        const { chatId } = req.params;

        const chat = await Chats.findById(chatId);

        if (chat.creator.toString() === userInfo.id) {
          next();
        } else {
          res.status(403).json({ message: 'Permission denied' });
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

        const user = await Users.findById(userInfo.id);
        const isMember = user.chats.find((chat) => chat.toString() === chatId);

        if (isMember) {
          next();
        } else {
          res.status(403).json({ message: 'Permission denied' });
        }
      } catch (error) {
        next(error);
      }
      break;
    }
    default: {
      res.status(403).json({ message: 'Permission denied' });
    }
  }
};
