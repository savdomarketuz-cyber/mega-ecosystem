// src/routes/product.routes.ts (TO'G'RI VA TO'LIQ KOD)

import { Router } from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    bulkUpdateProducts // <-- Import qo'shildi
} from '../controllers/product.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router(); // <-- E'lon qilish ishlatishdan oldin bo'lishi kerak

// Barcha uchun ochiq marshrutlar
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Faqat admin uchun yopiq marshrutlar
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/bulk-update/fulfillment', authMiddleware, adminMiddleware, bulkUpdateProducts); // <-- Yangi marshrut
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;