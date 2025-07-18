import { Schema } from 'mongoose';

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    is2FA: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    subscription_status: { type: Boolean, default: false }, 
    profile_picture_url: { type: String, default: './user.png' },
    profile_picture_id: { type: String, default: null },
}, { timestamps: true });

export default UserSchema;
