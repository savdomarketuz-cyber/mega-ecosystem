import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getStoreSettings = async (_: Request, res: Response) => {
  try {
    let settings = await prisma.storeSetting.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.storeSetting.create({ data: { id: 1 } });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Sozlamalarni olishda xatolik" });
  }
};

export const updateStoreSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.storeSetting.update({
      where: { id: 1 },
      data: req.body,
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Sozlamalarni yangilashda xatolik" });
  }
};