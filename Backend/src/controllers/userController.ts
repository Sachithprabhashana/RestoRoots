import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';

const createToken = (id: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email?.toLowerCase().trim() });
        if (!user) {
            res.status(400).json({ success: false, message: 'User does not exist' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const token = createToken(String(user._id));
        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }

        const normalizedEmail = email.toLowerCase().trim();
        const exists = await userModel.findOne({ email: normalizedEmail });
        if (exists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(String(user._id));

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};