import express from 'express';

import { Chats } from '../models/chats.js';

const router = express.Router();

router.get('/', async (_, res) => {
  console.log('Попал');
  const chats = await Chats.find({});
  res.json(chats);
});

router.post('/', async (req, res) => {
  try {
    const newChat = await Chats.create(req.body);
    res.status(201);
    res.json(newChat);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Chats.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const outdated = await Chats
      .findByIdAndUpdate(req.params.id, { $set: req.body });
    res.json(outdated);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

export default router;
