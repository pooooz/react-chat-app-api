import express from 'express';

import { verifyToken } from '../middlewares/tokenMiddleware.js';
import { Messages } from '../models/messages.js';

const router = express.Router();

router
  .get('/', verifyToken, async (_, res) => {
    const messages = await Messages.find();
    res.json(messages);
  })
  .get('/:chatId', verifyToken, async (req, res) => {
    const chatMessages = await Messages.find({ chatId: req.params.chatId });
    res.send(chatMessages);
  });

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const newMessage = await Messages.create(req.body);
    res.json(newMessage);
  } catch (error) {
    next(error);
  }
});

router.delete('/:messageId', verifyToken, async (req, res, next) => {
  try {
    const deleted = await Messages.findByIdAndDelete(req.params.messageId);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});

router.put('/:messageId', verifyToken, async (req, res, next) => {
  try {
    const outdated = await Messages.findByIdAndUpdate(req.params.messageId, { $set: req.body });
    res.json(outdated);
  } catch (error) {
    next(error);
  }
});

export default router;
