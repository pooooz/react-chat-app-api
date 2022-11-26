import { NextFunction, Request, Response } from 'express';

import { Messages } from '../../models/messages';

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
      const newMessage = await Messages.create(req.body);
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
      const outdated = await Messages.findByIdAndUpdate(req.params.messageId, { $set: req.body });
      res.json(outdated);
    } catch (error) {
      next(error);
    }
  }
}

export const MessagesController = new Message();
