// src/controllers/admin.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (_: Request, res: Response) => {
    try {
        const [userCount, productCount, orderCount, totalRevenue] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.order.aggregate({ _sum: { totalPrice: true } }),
        ]);
        res.json({
            users: userCount,
            products: productCount,
            orders: orderCount,
            revenue: totalRevenue._sum.totalPrice || 0,
        });
    } catch (error) {
        res.status(500).json({ error: "Statistikani olishda xatolik" });
    }
};