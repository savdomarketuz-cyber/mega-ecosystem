import { Router } from 'express';
import { getStoreSettings, updateStoreSettings } from '../controllers/settings.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
const router = Router();

router.get('/', authMiddleware, adminMiddleware, getStoreSettings);
router.put('/', authMiddleware, adminMiddleware, updateStoreSettings);

export default router;