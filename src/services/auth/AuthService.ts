import { SignupSchema, SignupDto } from 'dtos/auth/SignupDto';
import IAuthService from './interfaces/IAuthService';
import IUserRepository from 'repositories/auth/interfaces/IUserRepository';
import IHasher from 'types/IHasher';
import ValidationError from 'error/ValidationError';
import { ZodError } from 'zod';
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from 'utils/tokenUtils';
import RedisService from 'services/redis/RedisService';
import IAuthServiceUser from './interfaces/IAuthUser';

class AuthService implements IAuthService {
    constructor(
        private _userRepository: IUserRepository,
        private hasher: IHasher
    ) {}

    async signup(signupData: SignupDto): Promise<IAuthServiceUser & { accessToken: string }> {
        try {
            // Validate signup data
            SignupSchema.parse(signupData);

            const existingUser = await this._userRepository.findByPhoneNumber(signupData.phone_number);
            if (existingUser) {
                throw new ValidationError(['User already exists'], 'Duplicate Entry');
            }
            
            // Hash the password
            const hashedPassword = await this.hasher.hash(signupData.password);

            // Create the user
            const userData = { ...signupData, password: hashedPassword };
            const createUser = await this._userRepository.createUser(userData);
            
            // Generate tokens using the utility functions 
            let accessToken, refreshToken;
            try {
                accessToken = generateAccessToken(createUser);
                refreshToken = generateRefreshToken(createUser);
            } catch (tokenError) {
                console.error(`Token generation error:`, tokenError);
                throw new Error(`An error occured while generating authentication tokens.`);
            }

            //Store the refresh token in Redis with a TTL 
            const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
            try {
                await RedisService.storeRefreshToken(createUser.userId, refreshToken, REFRESH_TOKEN_TTL);
            } catch (redisError) {
                console.error(`Redis storage error:`, redisError);
                throw new Error(`An error occured while storing the refresh token.`);
            }
            
            // Send the response to the controler 
            return { ...createUser, accessToken };
        } catch (error) {
            if (error instanceof ZodError) {
                // Extract detailed validation messages
                const errorMessages = error.errors.map(err => `${err.message}`);
                console.error(`Signup validation error:`, errorMessages);
                throw new ValidationError(errorMessages, 'Validation Error');
            } else if (error instanceof ValidationError) {
                throw error; // Preserve existing ValidationErrors
            } else {
                console.error(`Unexpected signup error:`, error);
                throw new Error('An unexpected error occurred during signup.');
            }
        };
    } 

    async verifyToken(token: string): Promise<void> {
        try {
            await verifyAccessToken(token);
        } catch (tokenError) {
            throw tokenError;
        }
    }
}

export default AuthService;
