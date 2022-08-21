import express from 'express';

import { Chats } from '../models/chats.js';

const router = express.Router();

router.get('/', async (_, res) => {
  const chats = await Chats.find({});
  res.json(chats);
});

router.post('/', async (req, res, next) => {
  try {
    const newChat = await Chats.create(req.body);
    res.status(201);
    res.json(newChat);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Chats.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const outdated = await Chats
      .findByIdAndUpdate(req.params.id, { $set: req.body });
    res.json(outdated);
  } catch (error) {
    next(error);
  }
});

export default router;
