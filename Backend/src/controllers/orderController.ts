import { Request, Response } from 'express';
import Stripe from 'stripe';
import orderModel from '../models/orderModel.js';
import { AuthRequest } from '../middleware/auth.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { items, amount, address, paymentMethod, clientType } = req.body;

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

        // If mobile Cash on Delivery, no Stripe session is needed
        if (clientType === 'mobile' && paymentMethod === 'cod') {
            res.status(200).json({ success: true, message: 'Order placed (Cash on Delivery)' });
            return;
        }

        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            res.status(500).json({ success: false, message: 'STRIPE_SECRET_KEY is not configured' });
            return;
        }

        const stripe = new Stripe(secretKey);

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

        // 3. Add delivery fee ($2.50) as a line item
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Charges',
                },
                unit_amount: 250,
            },
            quantity: 1,
        });

        // 4. Create Stripe Checkout Session
        const backendOrigin = `${req.protocol}://${req.get('host')}`;
        const successUrl =
            clientType === 'mobile'
                ? `${backendOrigin}/api/order/verify-mobile?success=true&orderId=${newOrder._id}`
                : `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`;
        const cancelUrl =
            clientType === 'mobile'
                ? `${backendOrigin}/api/order/verify-mobile?success=false&orderId=${newOrder._id}`
                : `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`;

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
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

export const verifyOrderMobile = async (req: Request, res: Response): Promise<void> => {
    const { orderId, success } = req.query;

    try {
        if (success === 'true' && typeof orderId === 'string') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Payment Successful</title></head>
                <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb;padding:20px;">
                    <div style="background:#fff;padding:28px;border-radius:16px;text-align:center;max-width:360px;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
                        <div style="font-size:44px;margin-bottom:12px;">✅</div>
                        <h2 style="color:#262626;margin:0 0 8px;">Payment Successful!</h2>
                        <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:0;">Your RestoRoots order is confirmed. Switch back to the <strong>RestoRoots</strong> app to track your order.</p>
                    </div>
                </body>
                </html>
            `);
        } else {
            if (typeof orderId === 'string') {
                await orderModel.findByIdAndDelete(orderId);
            }
            res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Payment Cancelled</title></head>
                <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb;padding:20px;">
                    <div style="background:#fff;padding:28px;border-radius:16px;text-align:center;max-width:360px;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
                        <div style="font-size:44px;margin-bottom:12px;">❌</div>
                        <h2 style="color:#262626;margin:0 0 8px;">Payment Cancelled</h2>
                        <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:0;">No charge was made. You can return to the <strong>RestoRoots</strong> app and try again.</p>
                    </div>
                </body>
                </html>
            `);
        }
    } catch (error) {
        console.error('Error verifying mobile order:', error);
        res.status(500).send('Error verifying payment');
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

// List all orders for Admin Panel
export const listOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await orderModel.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error listing all orders:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
};

// Update order status from Admin Panel
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
};