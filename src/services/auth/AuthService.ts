import { SignupSchema, SignupDto } from 'dtos/auth/SignupDto';
import IAuthService from './interfaces/IAuthService';
import IAuthUser from './interfaces/IAuthUser';
import IUserRepository from 'repositories/auth/interfaces/IUserRepository';
import IHasher from 'types/IHasher';
import ValidationError from 'error/ValidationError';
import { ZodError } from 'zod';

class AuthService implements IAuthService {
    constructor(
        private _userRepository: IUserRepository,
        private hasher: IHasher
    ) {}

    async signup(signupData: SignupDto): Promise<IAuthUser> {
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
            return await this._userRepository.createUser(userData);
        } catch (error) {
            // const errorMessage = error.errors[0].message;
            // console.error(`Signup validation error:`, error);
            // throw new Error(`${errorMessage}`);
            // }`);
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
}

export default AuthService;
