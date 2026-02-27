import { Request, Response, NextFunction } from 'express';
import {User} from '../models/User.model';


export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const user = await User.findById(userId).select('-password');
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
    } catch (err) {
        next(err);
    }
};


export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const updates = req.body;
        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        next(err);
    }
};