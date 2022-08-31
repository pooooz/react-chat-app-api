import express from 'express';

import { verifyToken } from '../middlewares/tokenMiddleware.js';
import { Chats } from '../models/chats.js';
import { Users } from '../models/users.js';

const router = express.Router();

router.get('/:userId', verifyToken, async (req, res, next) => {
  try {
    const chats = await Chats.find({ creator: req.params.userId });
    res.json(chats);
  } catch (error) {
    next(error);
  }
});

router.post('/', verifyToken, async (req, res, next) => {
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
    const creator = await Users.findById(deleted.creator);
    const newChats = creator.chats.filter((chat) => chat._id.toString() !== req.params.id);

    await Users.findByIdAndUpdate(
      deleted.creator,
      { $set: { chats: newChats } },
    );
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
