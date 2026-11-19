import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    userId?: string;
    items: Array<{
        _id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    amount: number;
    address: {
        firstName: string;
        lastName: string;
        email: string;
        street: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
        phone: string;
    };
    status: string;
    payment: boolean;
    date: Date;
}

const orderSchema = new Schema<IOrder>({
    userId: { type: String, required: false },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'Food Processing' },
    payment: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
});

const orderModel = mongoose.models.order || mongoose.model<IOrder>('order', orderSchema);

export default orderModel;