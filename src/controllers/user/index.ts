import { NextFunction, Request, Response } from 'express';

import { Users } from '../../models/users';
import { ChangeNamePayloadSchema } from '../../dto/user';

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
    try {
      const { userId } = req.params;
      const { newName } = await ChangeNamePayloadSchema.validateAsync(req.body);

      const outdated = await Users.findByIdAndUpdate(userId, { $set: { name: newName } });
      res.json(outdated);
    } catch (error) {
      next(error);
    }
  }
}

export const UserController = new User();
