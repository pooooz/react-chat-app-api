import express from 'express';

import { MessagesController } from '../controllers/messages/index.js';

const router = express.Router();

router.get('/:chatId', MessagesController.getMessagesByChatId);
router.post('/', MessagesController.createMessage);
router.delete('/:messageId', MessagesController.deleteMessage);
router.put('/:messageId', MessagesController.updateMessage);

export default router;
