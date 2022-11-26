import { NextFunction, Request, Response } from 'express';

import { Messages } from '../../models/messages';
import { CreateMessagePayloadSchema, UpdateMessagePayloadSchema } from '../../dto/message';

class Message {
  async getMessagesByChatId(req: Request, res: Response, next: NextFunction) {
    try {
      const chatMessages = await Messages.find({ chatId: req.params.chatId });
      res.send(chatMessages);
    } catch (error) {
      next(error);
    }
  }

  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const validMessage = await CreateMessagePayloadSchema.validateAsync(req.body);

      const newMessage = await Messages.create(validMessage);
      res.json(newMessage);
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await Messages.findByIdAndDelete(req.params.messageId);
      res.json(deleted);
    } catch (error) {
      next(error);
    }
  }

  async updateMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const validMessage = await UpdateMessagePayloadSchema.validateAsync(req.body);

      const outdated = await Messages.findByIdAndUpdate(req.params.messageId, {
        $set: validMessage,
      });
      res.json(outdated);
    } catch (error) {
      next(error);
    }
  }
}

export const MessagesController = new Message();
