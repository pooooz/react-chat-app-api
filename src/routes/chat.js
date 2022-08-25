import express from 'express';

import { verifyToken } from '../middlewares/tokenMiddleware.js';
import { Chats } from '../models/chats.js';
import { Users } from '../models/users.js';

const router = express.Router();

router.get('/', verifyToken, async (_, res) => {
  const chats = await Chats.find({});
  res.json(chats);
});

router.post('/', async (req, res, next) => {
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
});

router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const deleted = await Chats.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const outdated = await Chats
      .findByIdAndUpdate(req.params.id, { $set: req.body });
    res.json(outdated);
  } catch (error) {
    next(error);
  }
});

export default router;
