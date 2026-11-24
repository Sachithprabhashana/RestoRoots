import express from 'express';
import {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus,
    verifyOrderMobile,
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/verify', verifyOrder);
orderRouter.post('/userorders', authMiddleware, userOrders);
orderRouter.get('/list', adminAuth, listOrders);
orderRouter.post('/status', adminAuth, updateStatus);
orderRouter.get('/verify-mobile', verifyOrderMobile);

export default orderRouter;