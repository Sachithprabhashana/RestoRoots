import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/food', foodRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('RestoRoots API is Running');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});