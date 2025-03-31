import IUserRepository from 'repositories/user/interfaces/IUserRepository';
import IUserService from './interfaces/IUserService';
import IProfile from './interfaces/IProfile';
import { verifyAccessToken } from 'utils/tokenUtils';

class UserService implements IUserService {
    private _userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    async getUserProfileDetails(accessToken: string): Promise<IProfile> {
        try {
            const decodedData = verifyAccessToken(accessToken);
            if (!decodedData) throw new Error(`AccessToken decoding failed: The provided token is invalid or malformed.`);
            
            const { userId } = decodedData;
            if (!userId) throw new Error(`User ID is missing in the decoded data. Ensure the token payload includes a valid 'userId' field.`);

            const profileDetails = await this._userRepository.findByUserId(userId);
            if (!profileDetails) throw new Error(`Failed to fetch profile details: No data was returned.`);

            return profileDetails;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;
