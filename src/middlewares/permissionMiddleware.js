import { Users } from '../models/users.js';

export const permissionCheck = (permission = 'creator') => async (req, res, next) => {
  switch (permission) {
    case 'creator': {
      try {
        const userInfo = req.user;
        const chatId = req.params.id;

        const user = await Users.findById(userInfo.id);
        const isOwner = user.chats.find((chat) => chat._id.toString() === chatId);

        if (isOwner) {
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
