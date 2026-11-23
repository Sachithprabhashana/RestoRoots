import { Request, Response } from 'express';
import fs from 'fs';
import foodModel from '../models/foodModel.js';
import cloudinary from '../config/cloudinary.js';

const uploadBufferToCloudinary = (fileBuffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'restoroots/foods',
                resource_type: 'image',
            },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error('Cloudinary upload failed'));
                    return;
                }
                resolve(result.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
};

// Add food item
export const addFood = async (req: Request, res: Response): Promise<void> => {
    try {
        let imageUrl = typeof req.body.image === 'string' ? req.body.image : '';

        if (req.file?.buffer) {
            imageUrl = await uploadBufferToCloudinary(req.file.buffer);
        }

        if (!imageUrl) {
            res.status(400).json({ success: false, message: 'Dish image is required' });
            return;
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: imageUrl,
        });

        await food.save();
        res.status(201).json({ success: true, message: 'Food Added', data: food });
    } catch (error) {
        console.error('Error adding food:', error);
        res.status(500).json({ success: false, message: 'Error adding food item' });
    }
};

// All food list
export const listFood = async (req: Request, res: Response): Promise<void> => {
    try {
        const foods = await foodModel.find({});
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.error('Error listing food:', error);
        res.status(500).json({ success: false, message: 'Error fetching food list' });
    }
};

// Remove food item
export const removeFood = async (req: Request, res: Response): Promise<void> => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            res.status(404).json({ success: false, message: 'Food item not found' });
            return;
        }

        // Delete uploaded file if it exists locally in /uploads
        if (food.image && !food.image.startsWith('http')) {
            fs.unlink(`uploads/${food.image}`, () => { });
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.status(200).json({ success: true, message: 'Food Removed' });
    } catch (error) {
        console.error('Error removing food:', error);
        res.status(500).json({ success: false, message: 'Error removing food item' });
    }
};