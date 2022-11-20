import express from 'express';

import { ChatsController } from '../controllers/chats/index.js';
import { permissionCheck } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.get('/:userId', ChatsController.getChatsByUserId);
router.post('/', ChatsController.createChat);
router.delete('/:chatId', permissionCheck('member'), ChatsController.leaveChat);
router.put('/:chatId', permissionCheck('creator'), ChatsController.addMember);

export default router;
