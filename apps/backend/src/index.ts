// src/index.ts (YANGI VA QISQA VERSION)

import express from "express";
import cors from "cors";

// Barcha marshrutlarni import qilamiz
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Asosiy middleware'lar
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

// Marshrutlarni ulash
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Serverni ishga tushirish
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});