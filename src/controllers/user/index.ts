import { NextFunction, Request, Response } from 'express';

import { Users } from '../../models/users';

class User {
  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    try {
      const user = await Users.findById(userId);
      if (user) {
        const { name, email } = user;
        res.json({ name, email });
      }
    } catch (error) {
      next(error);
    }
  }

  async changeName(req: Request, res: Response, next: NextFunction) {
    const { id, newName } = req.body;
    try {
      const outdated = await Users.findByIdAndUpdate(id, { $set: { name: newName } });
      res.json(outdated);
    } catch (error) {
      next(error);
    }
  }
}

export const UserController = new User();
