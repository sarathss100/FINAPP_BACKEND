import IAuthService from './interfaces/IAuthService';
import IAuthRepository from '../../repositories/auth/interfaces/IAuthRepository';
import IHasher from '../../types/utils/IHasher';
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from '../../utils/auth/tokenUtils';
import RedisService from '../../services/redis/RedisService';
import ISigninDTO from '../../dtos/auth/ISigninDTO';
import { AuthenticationError, ForbiddenError, ServerError, ValidationError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { SignupSchema } from '../../validation/auth/signup.validation';
import { ResetPasswordSchema } from '../../validation/auth/resetPassword.validation';
import { SigninSchema } from '../../validation/auth/signin.validation';
import IAuthUserDTO from '../../dtos/auth/IAuthUserDTO';
import UserMapper from '../../mappers/user/UserMapper';
import { extractUserIdFromToken, wrapServiceError } from '../../utils/serviceUtils';
import ISignupDTO from '../../dtos/auth/ISignupDTO';
import ITokenPayloadDTO from '../../dtos/auth/ITokenPayloadDTO';
import IUserDTO from '../../dtos/base/IUserDTO';
import IResetPasswordDTO from '../../dtos/auth/IResetPasswordDTO';
export default class AuthService implements IAuthService {
    private _authRepository: IAuthRepository;
    private _hasher: IHasher;

    constructor(authRepository: IAuthRepository, hasher: IHasher) {
        this._authRepository = authRepository;
        this._hasher = hasher;
    }

    async signup(signupData: ISignupDTO): Promise<IAuthUserDTO& { accessToken: string }> {
        try {
            SignupSchema.parse(signupData); 

            if (!signupData.phone_number) {
                throw new ValidationError(ErrorMessages.PHONE_NUMBER_MISSING, StatusCodes.BAD_REQUEST);
            }

            const existingUser = await this._authRepository.findByPhoneNumber(signupData.phone_number);

            if (existingUser) {
                throw new ValidationError(ErrorMessages.USER_ALREADY_EXISTS, StatusCodes.BAD_REQUEST);
            }

            if (!signupData.password) {
                throw new ValidationError(ErrorMessages.PASSWORD_MISSING, StatusCodes.BAD_REQUEST);
            }

            const hashedPassword = await this._hasher.hash(signupData.password);

            const userData = { ...signupData, password: hashedPassword };

            const mappedData = UserMapper.toModel(userData);

            const createUser = await this._authRepository.createUser(mappedData);

            const resultDTO = UserMapper.toIAuthUserDTO(createUser);
            
            // Generate tokens using the utility functions 
            let accessToken, refreshToken;

            try {
                accessToken = generateAccessToken(resultDTO);
                refreshToken = generateRefreshToken(resultDTO);
            } catch (error) {
                if (error) {
                    throw new ServerError(ErrorMessages.TOKEN_GENERATION_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
                }
            }

            if (!accessToken || !refreshToken) throw new ServerError(ErrorMessages.TOKEN_GENERATION_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);

            //Store the refresh token in Redis with a TTL 
            const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
            try {
                await RedisService.storeRefreshToken(resultDTO.userId, refreshToken, REFRESH_TOKEN_TTL);
            } catch (error) {
                if (error) {
                    // Roll back user creation if Redis fails 
                    await RedisService.deleteRefreshToken(resultDTO.userId);
                    throw new ServerError(ErrorMessages.REFRESH_TOKEN_STORAGE_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
                }
            }
            
            return { ...resultDTO, accessToken };
        } catch (error) {
            console.error('Error while Signing up: ', error);
            throw wrapServiceError(error); 
        };
    } 

    async verifyToken(token: string): Promise<ITokenPayloadDTO> {
        try {
            const decodedData = verifyAccessToken(token);

            if (!decodedData) throw new AuthenticationError(ErrorMessages.TOKEN_VERIFICATION_FAILED, StatusCodes.UNAUTHORIZED);

            const { phoneNumber } = decodedData;

            const userDetails = await this._authRepository.findByPhoneNumber(phoneNumber);

            const resultDTO = UserMapper.toIUserDTO(userDetails);

            if (!resultDTO) throw new ServerError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.BAD_REQUEST);

            decodedData.status = resultDTO?.status;

            return decodedData;
        } catch (error) {
            console.error('Error while verifying token: ', error);
            throw wrapServiceError(error);
        }
    }

    async signin(signinData: ISigninDTO): Promise<IAuthUserDTO & { accessToken: string }> {
        try {
            SigninSchema.parse(signinData);

            const userDetails = await this._authRepository.findByPhoneNumber(signinData.phone_number);

            if (!userDetails) {
                throw new ValidationError(ErrorMessages.USER_NOT_FOUND, StatusCodes.BAD_REQUEST);
            }

            if (userDetails && userDetails.status === false) {
                throw new ForbiddenError(ErrorMessages.USER_IS_BLOCKED);
            }

            const mapToDTO = UserMapper.toIAuthUserDTO(userDetails);

            const hashedPasswordInDatabase = mapToDTO.hashedPassword;

            const userProvidedPassword = signinData.password;

            // Check whether the password matches
            const isMatched = await this._hasher.verify(userProvidedPassword, hashedPasswordInDatabase!);

            if (!isMatched) {
                throw new ValidationError(ErrorMessages.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
            } 

            await this._authRepository.restoreUserAccount(mapToDTO.userId);

            // Generate tokens using the utility functions 
            let accessToken, refreshToken;

            try {
                accessToken = generateAccessToken(mapToDTO);
                refreshToken = generateRefreshToken(mapToDTO);
            } catch (error) {
                if (error) throw new ServerError(ErrorMessages.TOKEN_GENERATION_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            if (!accessToken || !refreshToken) throw new ServerError(ErrorMessages.TOKEN_GENERATION_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);

            //Store the refresh token in Redis with a TTL 
            const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
            try {
                await RedisService.storeRefreshToken(mapToDTO.userId, refreshToken, REFRESH_TOKEN_TTL);
            } catch (error) {
                if (error) throw new ServerError(ErrorMessages.REFRESH_TOKEN_STORAGE_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
            }
             
            return { ...mapToDTO, accessToken };
        } catch (error) {
            console.error('Error while signing in: ', error);
            throw wrapServiceError(error);
        };
    } 

    async signout(token: string): Promise<boolean> {
        try {
            const userId = extractUserIdFromToken(token);

            const isRefreshTokenRemoved = await RedisService.deleteRefreshToken(userId);

            if (!isRefreshTokenRemoved!) {
                throw new ServerError(ErrorMessages.REFRESH_TOKEN_REMOVAL_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
            }
            
            return true;
        } catch (error) {
            console.error('Error while signing out: ', error);
            throw wrapServiceError(error);
        }
    }

    async verifyPhoneNumber(phoneNumber: string): Promise<boolean> {
        try {
            const userDetails = await this._authRepository.findByPhoneNumber(phoneNumber);

            const resultDTO = UserMapper.toIUserDTO(userDetails);

            if (resultDTO?.status === false) throw new ForbiddenError(ErrorMessages.USER_IS_BLOCKED);

            return !!resultDTO?.status;
        } catch (error) {
            console.error('Error while verifying phone number: ', error);
            throw wrapServiceError(error);
        }
    }

    async getUserDetails(accessToken: string): Promise<IUserDTO> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            const userDetails = await this._authRepository.getUserDetails(userId);

            const resultDTO = UserMapper.toIUserDTO(userDetails);

            if (resultDTO?.status === false) throw new ForbiddenError(ErrorMessages.USER_IS_BLOCKED);

            return resultDTO;
        } catch (error) {
            console.error('Error while getting user details: ', error);
            throw wrapServiceError(error);
        }
    }

    async resetPassword(data: IResetPasswordDTO): Promise<boolean> {
        try {
            ResetPasswordSchema.parse(data);

            const userDetails = await this._authRepository.findByPhoneNumber(data.phone_number);

            if (!userDetails) {
                throw new ValidationError(ErrorMessages.PHONE_NUMBER_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const resultDTO = UserMapper.toIUserDTO(userDetails);

            const hashedPasswordInDatabase = resultDTO.password;
            const userProvidedPassword = data.password;

            // Check whether the password matches
            const isMatched = await this._hasher.verify(userProvidedPassword, hashedPasswordInDatabase!);

            if (isMatched) {
                throw new ValidationError(ErrorMessages.PASSWORD_MATCH_ERROR, StatusCodes.BAD_REQUEST);
            }

            // Hash the password
            const hashedPassword = await this._hasher.hash(data.password);

            // Update the data with hashedPassword and send to repository layer
            const userData = { ...data, password: hashedPassword };

            const isUpdated = await this._authRepository.resetPassword(userData);

            return !!isUpdated;
        } catch (error) {
            console.error('Error while resetting password: ', error);
            throw wrapServiceError(error);
        }
    }
}



