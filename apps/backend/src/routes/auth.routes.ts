// src/routes/auth.routes.ts

import { Router } from 'express';
import { login, getProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

export default router;