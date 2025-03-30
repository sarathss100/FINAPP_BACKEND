import { Schema } from 'mongoose';

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    status: { type: Boolean, default: true }
}, { timestamps: true });

export default UserSchema;
