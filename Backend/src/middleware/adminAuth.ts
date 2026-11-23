import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';

const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.token as string;
        if (!token) {
            res.status(401).json({ success: false, message: 'Not Authorized. Login required.' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await userModel.findById(decoded.id);

        if (!user || !user.isAdmin) {
            res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
            return;
        }

        if (!req.body) {
            req.body = {};
        }
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default adminAuth;