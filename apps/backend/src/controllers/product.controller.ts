// src/controllers/product.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async (_: Request, res: Response) => {
    const products = await prisma.product.findMany();
    res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return res.status(404).json({ error: "Mahsulot topilmadi" });
    res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, stock, categoryId, imageUrl } = req.body;
    if (!categoryId) return res.status(400).json({ error: "categoryId ko'rsatilishi shart" });
    const product = await prisma.product.create({
        data: { name, description, price, stock, categoryId, imageUrl },
    });
    res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const product = await prisma.product.update({
        where: { id: Number(id) },
        data: data,
    });
    res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  console.log(`--- DELETE PRODUCT FUNKSIYASI ISHLADI! O'chiriladigan ID: ${req.params.id} ---`);

  try {
    const { id } = req.params;
    const productId = Number(id);

    // Bitta tranzaksiya ichida bog'liq ma'lumotlarni va mahsulotni o'chiramiz
    await prisma.$transaction(async (tx) => {
      // 1. Shu mahsulotga bog'liq BARCHA OrderItem yozuvlarini o'chiramiz
      await tx.orderItem.deleteMany({
        where: {
          productId: productId,
        },
      });

      // 2. Endi mahsulotning o'zini o'chiramiz
      await tx.product.delete({
        where: {
          id: productId,
        },
      });
    });

    res.json({ message: "Mahsulot va unga bog'liq buyurtmalar ro'yxati o'chirildi" });
  } catch (error) {
    console.error("O'chirishda xatolik:", error);
    res.status(500).json({ error: "Mahsulotni o'chirishda xatolik" });
  }
};