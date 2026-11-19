import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
}

interface JwtPayload {
    id: string;
}

const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;
    const headerToken = req.headers.token as string | undefined;

    let token: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (headerToken) {
        token = headerToken;
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, please log in again' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ success: false, message: 'JWT secret is not configured' });
            return;
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authMiddleware;