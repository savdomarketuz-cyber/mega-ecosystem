// src/controllers/category.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCategories = async (_: Request, res: Response) => {
    const categories = await prisma.category.findMany({ include: { children: true } });
    res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
};

export const createCategory = async (req: Request, res: Response) => {
    const { name, parentId } = req.body;
    const category = await prisma.category.create({ data: { name, parentId } });
    res.json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, parentId } = req.body;
    const category = await prisma.category.update({
        where: { id: Number(id) },
        data: { name, parentId },
    });
    res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: Number(id) } });
    res.json({ message: "Kategoriya o‘chirildi" });
};