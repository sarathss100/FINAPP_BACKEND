import { SignupSchema, SignupDto } from 'dtos/auth/SignupDto';
import IAuthService from './interfaces/IAuthService';
import IAuthUser from './interfaces/IAuthUser';
import IUserRepository from 'repositories/auth/interfaces/IUserRepository';
import IHasher from 'interfaces/IHasher';
import ValidationError from 'error/ValidationError';

class AuthService implements IAuthService {
    constructor(
        private _userRepository: IUserRepository,
        private hasher: IHasher
    ) { }

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
            console.error(`Signup validation error:`, error);
            throw new Error(`Invalid signup data`);
        }
    } 
}

export default AuthService;
