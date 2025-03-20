import { Schema } from 'mongoose';

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

export default UserSchema;
