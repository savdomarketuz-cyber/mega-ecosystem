// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getAllUsers = async (_: Request, res: Response) => {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true } // Parolni qaytarmaslik uchun
    });
    res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === "ADMIN" ? "ADMIN" : "CUSTOMER";
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role: userRole },
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Foydalanuvchi yaratishda xato" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const dataToUpdate: any = { name, email, role };
    if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    const user = await prisma.user.update({
        where: { id: Number(id) },
        data: dataToUpdate,
    });
    res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Tranzaksiya ichida o'chirish
        await prisma.$transaction([
          prisma.orderItem.deleteMany({ where: { order: { userId: Number(id) } } }),
          prisma.order.deleteMany({ where: { userId: Number(id) } }),
          prisma.user.delete({ where: { id: Number(id) } })
        ]);
        res.json({ message: "Foydalanuvchi va uning barcha buyurtmalari o‘chirildi" });
    } catch (err) {
        res.status(500).json({ error: "Foydalanuvchini o‘chirishda xato" });
    }
};