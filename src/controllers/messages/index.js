import { Messages } from '../../models/messages.js';

class Message {
  async getMessagesByChatId(req, res, next) {
    try {
      console.log(req.user);
      const chatMessages = await Messages.find({ chatId: req.params.chatId });
      res.send(chatMessages);
    } catch (error) {
      next(error);
    }
  }

  async createMessage(req, res, next) {
    try {
      const newMessage = await Messages.create(req.body);
      res.json(newMessage);
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const deleted = await Messages.findByIdAndDelete(req.params.messageId);
      res.json(deleted);
    } catch (error) {
      next(error);
    }
  }

  async updateMessage(req, res, next) {
    try {
      const outdated = await Messages.findByIdAndUpdate(req.params.messageId, { $set: req.body });
      res.json(outdated);
    } catch (error) {
      next(error);
    }
  }
}

export const MessagesController = new Message();
