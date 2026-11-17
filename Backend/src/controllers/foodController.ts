import { Request, Response } from 'express';
import { foodModel } from '../models/foodModel.js';

export const addFood = async (req: Request, res: Response): Promise<void> => {
    try {
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image,
        });
        await food.save();
        res.json({ success: true, message: 'Food Added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding food' });
    }
};

export const listFood = async (req: Request, res: Response): Promise<void> => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching food list' });
    }
};