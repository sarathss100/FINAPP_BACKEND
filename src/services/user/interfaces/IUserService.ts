import IProfile from './IProfile';

interface IUserService {
    getUserProfileDetails(accessToken: string): Promise<IProfile>;
}

export default IUserService;
