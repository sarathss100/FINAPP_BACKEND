import { Request, Response } from 'express';
import IAuthController from './IAuthController';
import IAuthService from 'services/auth/interfaces/IAuthService';

class AuthController implements IAuthController {
    private readonly _authService: IAuthService;

    constructor(authService: IAuthService) {
        this._authService = authService;
    }

    async signup(request: Request, response: Response): Promise<void> {
        try {
            const signupData = request.body;

            const user = await this._authService.signup(signupData);

            response.status(201).json({ message: `User created successfully`, user });
        } catch (error) {
            response.status(400).json({ error: error instanceof Error ? error.message : `An error occured during signup` })
        }
    }
}

export default AuthController;
