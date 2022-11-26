import express from 'express';

import { UserController } from '../controllers/user';
import { permissionCheck } from '../middlewares/permissionMiddleware';

const router = express.Router();

router.get('/:userId', UserController.getUserInfo);
router.patch('/:userId/changeName', permissionCheck('isAccountOwner'), UserController.changeName);

export default router;
