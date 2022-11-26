import express from 'express';

import { AuthController } from '../controllers/auth';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.logIn);
router.post('/refresh', AuthController.refreshToken);

export default router;
