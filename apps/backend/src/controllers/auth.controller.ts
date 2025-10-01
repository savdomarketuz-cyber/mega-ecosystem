// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: "Parol noto‘g‘ri" });

        const token = jwt.sign(
            { id: user.id, role: String(user.role).toUpperCase() },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login jarayonida xato" });
    }
};

export const getProfile = async (req: Request & { user?: any }, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Profilni olishda xato" });
    }
};