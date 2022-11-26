import express from 'express';

import { MessagesController } from '../controllers/messages';
import { permissionCheck } from '../middlewares/permissionMiddleware';

const router = express.Router();

router.get('/:chatId', permissionCheck('member'), MessagesController.getMessagesByChatId);
router.post('/', MessagesController.createMessage);
router.delete('/:messageId', MessagesController.deleteMessage);
router.put('/:messageId', MessagesController.updateMessage);

export default router;
