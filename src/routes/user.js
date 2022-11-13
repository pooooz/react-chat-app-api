import express from 'express';

import { UserController } from '../controllers/user/index.js';

const router = express.Router();

router.get('/:userId', UserController.getUserInfo);
router.patch('/changeName', UserController.changeName);

export default router;
