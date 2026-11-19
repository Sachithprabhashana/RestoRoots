import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import orderRouter from './routes/orderRoute';
import userRouter from './routes/userRoute.js';



const app: Express = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);

connectDB();

app.use('/api/food', foodRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('RestoRoots API is Running');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});