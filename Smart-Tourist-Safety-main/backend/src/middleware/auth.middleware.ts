import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config';


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization as string;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });


    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, jwtConfig.secret) as any;
        (req as any).userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};