// src/routes/product.routes.ts (YAKUNIY, TO'LIQ KOD)

import { Router } from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    bulkUpdateProducts,
    getProductDeliveryEstimate // <-- YANGI IMPORT QO'SHILDI
} from '../controllers/product.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Barcha uchun ochiq marshrutlar
router.get('/', getAllProducts);

// Muhim: Aniqroq marshrutlar umumiyroq marshrutlardan oldin turishi kerak
router.get('/:id/delivery-estimate', getProductDeliveryEstimate); // <-- YANGI MARSHRUT QO'SHILDI
router.get('/:id', getProductById);


// Faqat admin uchun yopiq marshrutlar
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/bulk-update/fulfillment', authMiddleware, adminMiddleware, bulkUpdateProducts);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;