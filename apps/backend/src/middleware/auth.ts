// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token yo‘q yoki formati noto‘g‘ri" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = { ...decoded, role: String(decoded.role).toUpperCase() };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token noto‘g‘ri yoki muddati tugagan" });
  }
}

export function adminMiddleware(req: Request & { user?: any }, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Ruxsat yo‘q. Faqat admin kirishi mumkin" });
  }
  next();
}