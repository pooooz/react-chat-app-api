import express from 'express';

import { Users } from '../models/users.js';

const router = express.Router();

router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const { name, email } = await Users.findById(userId);
    res.json({ name, email });
  } catch (error) {
    next(error);
  }
});

router
  .patch('/change-name', async (req, res, next) => {
    const { id, newName } = req.body;
    try {
      const outdated = await Users.findByIdAndUpdate(id, { $set: { name: newName } });
      res.json(outdated);
    } catch (error) {
      next(error);
    }
  });

export default router;
