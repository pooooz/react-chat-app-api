import express from 'express';

import { Messages } from '../models/messages.js';

const router = express.Router();

router
  .get('/', async (_, res) => {
    const messages = await Messages.find();
    res.json(messages);
  })
  .get('/:chatId', async (req, res) => {
    const chatMessages = await Messages.find({ chatId: req.params.chatId });
    res.send(chatMessages);
  });

router.post('/', async (req, res, next) => {
  try {
    const newMessage = await Messages.create(req.body);
    res.json(newMessage);
  } catch (error) {
    next(error);
  }
});

router.delete('/:messageId', async (req, res, next) => {
  try {
    const deleted = await Messages.findByIdAndDelete(req.params.messageId);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});

router.put('/:messageId', async (req, res, next) => {
  try {
    const outdated = await Messages.findByIdAndUpdate(req.params.messageId, { $set: req.body });
    res.json(outdated);
  } catch (error) {
    next(error);
  }
});

export default router;
