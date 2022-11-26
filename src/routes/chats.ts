import express from 'express';

import { ChatsController } from '../controllers/chats';
import { permissionCheck } from '../middlewares/permissionMiddleware';

const router = express.Router();

router.get('/:userId', ChatsController.getChatsByUserId);
router.post('/', ChatsController.createChat);
router.delete('/:chatId', permissionCheck('member'), ChatsController.leaveChat);
router.put('/:chatId', permissionCheck('creator'), ChatsController.addMember);

export default router;
