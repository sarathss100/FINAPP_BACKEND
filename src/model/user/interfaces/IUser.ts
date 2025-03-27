import { Document } from 'mongoose';

interface IUser extends Document {
    first_name: string;
    last_name: string;
    phone_number: string;
    password: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default IUser;
