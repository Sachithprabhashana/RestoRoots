import express from 'express';
import { addFood, listFood } from '../controllers/foodController.js';

const foodRouter = express.Router();
foodRouter.post('/add', addFood);
foodRouter.get('/list', listFood);

export default foodRouter;