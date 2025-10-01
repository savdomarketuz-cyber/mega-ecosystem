// src/controllers/order.controller.ts

import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { items } = req.body;
        const userId = req.user.id;
        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Buyurtmada mahsulotlar yo'q" });
        }
        const productIds = items.map((item: any) => item.productId);
        const productsInDb = await prisma.product.findMany({ where: { id: { in: productIds } } });
        let totalPrice = 0;
        for (const item of items) {
            const product = productsInDb.find((p) => p.id === item.productId);
            if (!product) return res.status(400).json({ error: `Mahsulot topilmadi: ID ${item.productId}` });
            if (product.stock < item.quantity) return res.status(400).json({ error: `Omborda yetarli mahsulot yo'q` });
            totalPrice += product.price * item.quantity;
        }
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId, totalPrice, status: OrderStatus.NEW,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId, quantity: item.quantity,
                            price: productsInDb.find(p => p.id === item.productId)!.price,
                        })),
                    },
                },
                include: { items: true },
            });
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            return newOrder;
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Buyurtma yaratishda xatolik" });
    }
};

export const getAllOrders = async (req: Request & { user?: any }, res: Response) => {
    let orders;
    if (req.user.role === "ADMIN") {
        orders = await prisma.order.findMany({ include: { items: true, user: true } });
    } else {
        orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: { items: true },
        });
    }
    res.json(orders);
};

export const getOrderById = async (req: Request & { user?: any }, res: Response) => {
    const orderId = parseInt(req.params.id);
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } }, user: true },
    });
    if (!order) return res.status(404).json({ error: "Buyurtma topilmadi" });
    if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
        return res.status(403).json({ error: "Ruxsat yo‘q" });
    }
    res.json(order);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ error: "Status noto'g'ri" });
    }
    const updatedOrder = await prisma.order.update({
        where: { id: Number(id) },
        data: { status: status },
    });
    res.json(updatedOrder);
};

export const deleteOrder = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });
    res.json({ message: "Buyurtma o‘chirildi" });
};