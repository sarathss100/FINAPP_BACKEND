import { SignupSchema, SignupDto } from 'dtos/auth/SignupDto';
import IAuthService from './interfaces/IAuthService';
import IAuthRepository from 'repositories/auth/interfaces/IAuthRepository';
import IHasher from 'types/IHasher';
import ValidationError from 'error/ValidationError';
import { ZodError } from 'zod';
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from 'utils/tokenUtils';
import RedisService from 'services/redis/RedisService';
import IAuthServiceUser from './interfaces/IAuthUser';
import { SigninDto, SigninSchema } from 'dtos/auth/SigninDto';
import ITokenPayload from 'types/ITokenPayload';
import { ResetPasswordDto, ResetPasswordSchema } from 'dtos/auth/ResetPasswordDto';

class AuthService implements IAuthService {
    private _authRepository: IAuthRepository;
    private _hasher: IHasher;
    constructor(authRepository: IAuthRepository, hasher: IHasher) {
        this._authRepository = authRepository;
        this._hasher = hasher;
    }

    async signup(signupData: SignupDto): Promise<IAuthServiceUser & { accessToken: string }> {
        try {
            // Validate signup data
            SignupSchema.parse(signupData);

            const existingUser = await this._authRepository.findByPhoneNumber(signupData.phone_number);
            if (existingUser) {
                throw new ValidationError(['User already exists'], 'Duplicate Entry');
            }
            
            // Hash the password
            const hashedPassword = await this._hasher.hash(signupData.password);

            // Create the user
            const userData = { ...signupData, password: hashedPassword };
            const createUser = await this._authRepository.createUser(userData);
            
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
                // Roll back user creation if Redis fails 
                await RedisService.deleteRefreshToken(createUser.userId);
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

    async verifyToken(token: string): Promise<ITokenPayload> {
        try {
            const decodedData = verifyAccessToken(token);
            return decodedData;
        } catch (tokenError) {
            throw tokenError;
        }
    }

    async signin(signinData: SigninDto): Promise<IAuthServiceUser & { accessToken: string }> {
        try {
            // Validate signup data
            SigninSchema.parse(signinData);

            const user = await this._authRepository.findByPhoneNumber(signinData.phone_number);
            if (!user) {
                throw new Error(`The user dosen't exist`);
            }

            const hashedPasswordInDatabase = user.hashedPassword;
            const userProvidedPassword = signinData.password;

            // Check whether the password matches
            const isMatched = await this._hasher.verify(userProvidedPassword, hashedPasswordInDatabase!);

            if (!isMatched) {
                throw new Error('Please Enter Correct Password');
            } 

            // Generate tokens using the utility functions 
            let accessToken, refreshToken;
            try {
                accessToken = generateAccessToken(user);
                refreshToken = generateRefreshToken(user);
            } catch (tokenError) {
                console.error(`Token generation error:`, tokenError);
                throw new Error(`An error occured while generating authentication tokens.`);
            }

            //Store the refresh token in Redis with a TTL 
            const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
            try {
                await RedisService.storeRefreshToken(user.userId, refreshToken, REFRESH_TOKEN_TTL);
            } catch (redisError) {
                console.error(`Redis storage error:`, redisError);
                throw new Error(`An error occured while storing the refresh token.`);
            }
            
            // Send the response to the controller 
            return { ...user, accessToken };
        } catch (error) {
            // Extract and log the error message
            let errorMessage = `An unexpected error occured during signin`;
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error instanceof ZodError) {
                errorMessage = `Please enter valid Phone Number or Password`;
            }

            console.log(errorMessage);

            throw new Error(errorMessage);
        };
    } 

    async signout(token: string): Promise<boolean> {
        try {
            const verifiedUserDetails = this.verifyToken(token);
            if (!verifiedUserDetails) {
                throw new Error(`accessTokenVerification Failure`);
            }
            const userId = (await verifiedUserDetails).userId;

            if (!userId) {
                throw new Error(`User ID not found in verifiedUserDetails`);
            }

            const isRefreshTokenRemoved = await RedisService.deleteRefreshToken(userId);

            if (!isRefreshTokenRemoved!) {
                throw new Error(`Failed to Remove refresh Token From Redis`);
            }
            
            return true;
        } catch (error) {
            // Extract and log the error message
            let errorMessage = `An error occured while try to signout`;
            if (error instanceof Error) {
                errorMessage = error.message;
            } 

            throw new Error(errorMessage);
        }
    }

    async verifyPhoneNumber(phoneNumber: string): Promise<boolean> {
        try {
            if (!phoneNumber) throw new Error('Phone number is missing');
            const userDetails = await this._authRepository.findByPhoneNumber(phoneNumber);
            return userDetails?.status ?  true : false;
        } catch (error) {
            // Extract and log the error message
            let errorMessage = `Something went wrong!`;
            if (error instanceof Error) {
                errorMessage = error.message;
            } 

            throw new Error(errorMessage);
        }
    }

    async resetPassword(data: ResetPasswordDto): Promise<boolean> {
        try {
            // Validate the data
            ResetPasswordSchema.parse(data);

            const user = await this._authRepository.findByPhoneNumber(data.phone_number);
            if (!user) {
                throw new Error(`This number dosen't exists`);
            }

            const hashedPasswordInDatabase = user.hashedPassword;
            const userProvidedPassword = data.password;

            // Check whether the password matches
            const isMatched = await this._hasher.verify(userProvidedPassword, hashedPasswordInDatabase!);

            if (isMatched) {
                throw new Error("The entered password is the same as your current password. Please enter a new password.");
            }

             // Hash the password
            const hashedPassword = await this._hasher.hash(data.password);

            // Update the data with hashedPassword and send to repository layer
            const userData = { ...data, password: hashedPassword };

            const isUpdated = await this._authRepository.resetPassword(userData);
            return isUpdated ? true : false ;
        } catch (error) {
            // Extract and log the error message
            let errorMessage = `Something went wrong!`;
            if (error instanceof Error) {
                errorMessage = error.message;
            } 

            throw new Error(errorMessage);
        }
    }
}

export default AuthService;



