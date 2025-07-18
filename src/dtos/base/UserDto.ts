
interface IUser {
    first_name: string;
    last_name: string;
    phone_number?: string;
    password?: string;
    role: string;
    status: boolean;
    is2FA: boolean;
    isDeleted: boolean;
    subscription_status: boolean;
    profile_picture_url?: string;
    profile_picture_id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default IUser;
