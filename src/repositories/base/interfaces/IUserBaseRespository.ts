import IAuthUser from './IAuthUser';

interface IUserBaseRespository {
    findByPhoneNumber(phoneNumber: string): Promise<IAuthUser | null>;
}

export default IUserBaseRespository;
