// src/controllers/product.controller.ts (TO'LIQ YANGI VERSION)

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateDeliveryDate } from '../utils/deliveryCalculator';

const prisma = new PrismaClient();

// Barcha mahsulotlarni olish
export const getAllProducts = async (_: Request, res: Response) => {
    const products = await prisma.product.findMany();
    res.json(products);
};

// Bitta mahsulotni olish
export const getProductById = async (req: Request, res: Response) => {
    console.log("--- getProductById FUNKSIYASI ISHGA TUSHDI ---");
    try {
        const { id } = req.params;
        console.log(`1. URL'dan olingan ID: "${id}" (tipi: ${typeof id})`);

        const productId = Number(id);
        console.log(`2. Songa o'girilgan ID: ${productId} (tipi: ${typeof productId})`);

        if (isNaN(productId)) {
            console.error("XATO: ID'ni songa o'girib bo'lmadi!");
            return res.status(400).json({ error: "ID noto'g'ri formatda" });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        console.log("3. Bazadan topilgan mahsulot:", product);

        if (!product) {
            console.error("4. Mahsulot topilmadi, 404 qaytarilmoqda.");
            return res.status(404).json({ error: "Mahsulot topilmadi" });
        }

        console.log("5. Muvaffaqiyatli! Mahsulot qaytarilmoqda.");
        res.json(product);
    } catch (error) {
        console.error("getProductById ichida kutilmagan xato:", error);
        res.status(500).json({ error: "Mahsulotni olishda xatolik" });
    }
};

// Yangi mahsulot yaratish
export const createProduct = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        // 3. Market artikulini avtomatik yaratish (12 xonali tasodifiy son)
        const marketSku = Math.floor(100000000000 + Math.random() * 900000000000).toString();

        const product = await prisma.product.create({
            data: {
                ...data,
                marketSku: marketSku, // Avtomatik yaratilgan SKU'ni qo'shamiz
            },
        });
        res.status(201).json(product);
    } catch (error) {
        console.error("Mahsulot yaratishda xato:", error);
        res.status(500).json({ error: "Mahsulot yaratishda xatolik" });
    }
};

// Mahsulotni yangilash
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: data,
        });
        res.json(product);
    } catch (error) {
        console.error("Mahsulotni yangilashda xato:", error);
        res.status(500).json({ error: "Mahsulotni yangilashda xatolik" });
    }
};

// Mahsulotni o'chirish
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productId = Number(id);
        await prisma.$transaction(async (tx) => {
            await tx.orderItem.deleteMany({ where: { productId: productId } });
            await tx.product.delete({ where: { id: productId } });
        });
        res.json({ message: "Mahsulot o'chirildi" });
    } catch (error) {
        console.error("O'chirishda xatolik:", error);
        res.status(500).json({ error: "Mahsulotni o'chirishda xatolik" });
    }
};
export const bulkUpdateProducts = async (req: Request, res: Response) => {
  try {
    const { productIds, settings } = req.body;
    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: settings,
    });
    res.json({ message: `${productIds.length} ta mahsulot yangilandi.` });
  } catch (error) {
    res.status(500).json({ error: "Mahsulotlarni ommaviy yangilashda xatolik" });
  }
};

export const getProductDeliveryEstimate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({ where: { id: Number(id) } });
        
        // Sozlamalarni qidiramiz, agar yo'q bo'lsa - yaratamiz
        let settings = await prisma.storeSetting.findUnique({ where: { id: 1 } });
        if (!settings) {
            settings = await prisma.storeSetting.create({ data: { id: 1 } });
        }

        if (!product) {
            return res.status(404).json({ error: "Mahsulot topilmadi" });
        }

        const deliveryDateString = calculateDeliveryDate(product, settings);
        res.json({ deliveryDate: deliveryDateString });
    } catch (error) {
        res.status(500).json({ error: "Hisoblashda xatolik" });
    }
};