// src/routes/admin.routes.ts

import { Router } from 'express';
import { getStats } from '../controllers/admin.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/stats', authMiddleware, adminMiddleware, getStats);

export default router;