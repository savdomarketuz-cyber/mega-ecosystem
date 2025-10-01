// src/routes/user.routes.ts

import { Router } from 'express';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.post('/', createUser); // Hammaga ruxsat (registratsiya)
router.put('/:id', authMiddleware, updateUser); // O'zgartirish uchun login bo'lishi kerak
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;