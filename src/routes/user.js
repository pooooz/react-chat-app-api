import express from 'express';

import { verifyToken } from '../middlewares/tokenMiddleware.js';
import { Users } from '../models/users.js';

const router = express.Router();

router.get('/:userId', verifyToken, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const { username, email } = await Users.findById(userId);
    res.json({ username, email });
  } catch (error) {
    next(error);
  }
});

router
  .patch('/change-name', verifyToken, async (req, res, next) => {
    const { userId, newName } = req.body;
    try {
      const outdated = await Users.findByIdAndUpdate(userId, { $set: { username: newName } });
      res.json(outdated);
    } catch (error) {
      next(error);
    }
  });

export default router;
