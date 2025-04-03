import IUserRepository from 'repositories/user/interfaces/IUserRepository';
import IUserService from './interfaces/IUserService';
import IProfile from './interfaces/IProfile';
import { verifyAccessToken } from 'utils/auth/tokenUtils';
import { AppError, AuthenticationError, ServerError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';

class UserService implements IUserService {
    private _userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    async getUserProfileDetails(accessToken: string): Promise<IProfile> {
        try {
            const decodedData = verifyAccessToken(accessToken);
            if (!decodedData) throw new AuthenticationError(ErrorMessages.TOKEN_VERIFICATION_FAILED, StatusCodes.UNAUTHORIZED);;
            
            const { userId } = decodedData;
            if (!userId) throw new ServerError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);

            const profileDetails = await this._userRepository.findByUserId(userId);
            if (!profileDetails) throw new AuthenticationError(ErrorMessages.FETCH_USER_PROFILE_FAILED, StatusCodes.BAD_REQUEST);

            return profileDetails;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw error;
            }
        }
    }
}

export default UserService;
