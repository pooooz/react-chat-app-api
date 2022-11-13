import { Users } from '../../models/users.js';

class User {
  async getUserInfo(req, res, next) {
    const { userId } = req.params;
    try {
      const { name, email } = await Users.findById(userId);
      res.json({ name, email });
    } catch (error) {
      next(error);
    }
  }

  async changeName(req, res, next) {
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
