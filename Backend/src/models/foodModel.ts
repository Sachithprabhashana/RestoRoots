import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

const foodSchema = new Schema<IFood>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
}, { collection: 'foods' }); // <-- Explicitly forces the collection name to 'foods'

export const foodModel = mongoose.models.food || mongoose.model<IFood>('food', foodSchema);