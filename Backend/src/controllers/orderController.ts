import { Request, Response } from 'express';
import Stripe from 'stripe';
import orderModel from '../models/orderModel.js';
import { AuthRequest } from '../middleware/auth.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            res.status(500).json({ success: false, message: 'STRIPE_SECRET_KEY is not configured' });
            return;
        }

        const stripe = new Stripe(secretKey);
        const { items, amount, address } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ success: false, message: 'Cart is empty' });
            return;
        }

        // 1. Save order in MongoDB with payment: false initially
        const newOrder = new orderModel({
            items,
            userId: req.userId,
            amount,
            address,
            payment: false,
        });
        await newOrder.save();

        // 2. Build Stripe line_items from cart items
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // Stripe uses cents
            },
            quantity: item.quantity,
        }));

        // 3. Add delivery fee ($2) as a line item
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Charges',
                },
                unit_amount: 200,
            },
            quantity: 1,
        });

        // 4. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.status(200).json({ success: true, session_url: session.url });
    } catch (error: any) {
        console.error('Error placing order:', error);
        res.status(500).json({
            success: false,
            message: error?.message || 'Error creating Stripe checkout session',
        });
    }
};

export const verifyOrder = async (req: Request, res: Response): Promise<void> => {
    const { orderId, success } = req.body;

    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.status(200).json({ success: true, message: 'Payment verified' });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({ success: false, message: 'Payment cancelled' });
        }
    } catch (error) {
        console.error('Error verifying order:', error);
        res.status(500).json({ success: false, message: 'Error verifying payment' });
    }
};

export const userOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const orders = await orderModel.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
};