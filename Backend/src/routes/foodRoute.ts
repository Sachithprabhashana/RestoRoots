import express from 'express';
import multer from 'multer';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import adminAuth from '../middleware/adminAuth.js';

const foodRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

foodRouter.post('/add', adminAuth, upload.single('image'), addFood);
foodRouter.get('/list', listFood);
foodRouter.post('/remove', adminAuth, removeFood);

export default foodRouter;