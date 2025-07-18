
interface IProfile {
    userId: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    is2FA: boolean,
    subscription_status: boolean,
    profilePictureUrl: string, 
}

export default IProfile;
