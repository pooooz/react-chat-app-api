import { Chats } from '../../models/chats.js';
import { Users } from '../../models/users.js';

class Chat {
  async getChatsByUserId(req, res, next) {
    try {
      const user = await Users.findById(req.params.userId);
      if (user.chats.length !== 0) {
        const chats = user.chats.map(async (chatId) => Chats.findById(chatId));
        Promise.all(chats).then((result) => {
          res.json(result);
        });
        return;
      }

      res.json([]);
    } catch (error) {
      next(error);
    }
  }

  async createChat(req, res, next) {
    try {
      const newChat = await Chats.create(req.body);
      const creator = await Users.findById(req.body.creator);
      await Users.findByIdAndUpdate(
        req.body.creator,
        { $set: { chats: [...creator.chats, newChat._id] } },
      );
      res.status(201);
      res.json(newChat);
    } catch (error) {
      next(error);
    }
  }

  async leaveChat(req, res, next) {
    try {
      const member = await Users.findById(req.user.id);
      const newChats = member.chats.filter((chat) => chat._id.toString() !== req.params.chatId);

      await Users.findByIdAndUpdate(
        req.user.id,
        { $set: { chats: newChats } },
      );
      res.json({ _id: req.params.chatId });
    } catch (error) {
      next(error);
    }
  }

  async addMember(req, res, next) {
    try {
      const { id } = req.body;
      const member = await Users.findById(id);

      if (member) {
        const newChats = [...member.chats, req.params.chatId];

        const isAlreadyMember = member.chats.find(
          (chatId) => chatId.toString() === req.params.chatId,
        );

        if (isAlreadyMember) {
          res.json({ isInvited: true });
          return;
        }

        await Users.findByIdAndUpdate(
          id,
          { $set: { chats: newChats } },
        );
        res.json({ isInvited: true });
      } else {
        next({ status: 400, message: 'The user with the given id does not exist' });
      }
    } catch (error) {
      next(error);
    }
  }
}

export const ChatsController = new Chat();
