// src/routes/order.routes.ts

import { Router } from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/order.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Barcha orderlarni faqat admin ko'rsin, customer o'zinikini
router.get('/', authMiddleware, getAllOrders);
router.post('/', authMiddleware, createOrder);
router.get('/:id', authMiddleware, getOrderById);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOrder);
router.put('/:id/status', authMiddleware, updateOrderStatus);

export default router;