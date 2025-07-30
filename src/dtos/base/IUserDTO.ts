
export default interface IUserDTO {
    _id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    password: string;
    role: string;
    is2FA: boolean;
    isDeleted: boolean;
    status: boolean;
    profile_picture_url?: string;
    profile_picture_id?: string;
    subscription_status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
