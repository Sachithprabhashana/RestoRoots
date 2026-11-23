import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    cartData: Record<string, number>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        cartData: { type: Object, default: {} },
        isAdmin: { type: Boolean, default: false },
    },
    { minimize: false, timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model<IUser>('user', userSchema);

export default userModel;