import express from 'express';

import { ChatsController } from '../controllers/chats/index.js';
import { permissionCheck } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.get('/:userId', ChatsController.getChatsByUserId);
router.post('/', ChatsController.createChat);
router.delete('/:id', permissionCheck('creator'), ChatsController.deleteChat);
router.put('/:id', ChatsController.updateChat);

export default router;
