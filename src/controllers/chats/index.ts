import { NextFunction, Request, Response } from 'express';

import { Chats } from '../../models/chats';
import { Users } from '../../models/users';
import { CustomResponseError } from '../../utils/exceptions';
import { AddMemberPayloadSchema, CreateChatPayloadSchema } from '../../dto/chat';

class Chat {
  async getChatsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await Users.findById(req.params.userId);

      if (user && user.chats.length !== 0) {
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

  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      const validChatPayload = await CreateChatPayloadSchema.validateAsync(req.body);

      const newChat = await Chats.create(validChatPayload);
      const creator = await Users.findById(validChatPayload.creator);

      if (creator) {
        await Users.findByIdAndUpdate(
          validChatPayload.creator,
          { $set: { chats: [...creator.chats, newChat._id] } },
        );
        res.status(201);
        res.json(newChat);
      }
    } catch (error) {
      next(error);
    }
  }

  async leaveChat(req: Request, res: Response, next: NextFunction) {
    try {
      const member = await Users.findById(req.user?.id);

      if (member) {
        const newChats = member.chats.filter((chat) => chat._id.toString() !== req.params.chatId);

        await Users.findByIdAndUpdate(
          req.user?.id,
          { $set: { chats: newChats } },
        );
        res.json({ _id: req.params.chatId });
      }
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = await AddMemberPayloadSchema.validateAsync(req.body);
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
        next(new CustomResponseError(400, 'The user with the given id does not exist'));
      }
    } catch (error) {
      next(error);
    }
  }
}

export const ChatsController = new Chat();
