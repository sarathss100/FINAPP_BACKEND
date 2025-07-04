import { Router } from 'express';
import AuthService from 'services/auth/AuthService';
import AuthController from 'controller/auth/AuthController';
import IAuthController from 'controller/auth/ineterfaces/IAuthController';
import BcryptHasher from 'utils/auth/hash';
import AuthRepository from 'repositories/auth/AuthRepository';

const router = Router();
const authRepository = new AuthRepository();
const hasher = new BcryptHasher();
const authService = new AuthService(authRepository, hasher);
const authController: IAuthController = new AuthController(authService);

router.post('/signup', authController.signup.bind(authController));
router.post('/signin', authController.signin.bind(authController));
router.post('/signout', authController.signout.bind(authController));
router.post('/password', authController.resetPassword.bind(authController));

// Verification Routes
router.post('/verifications/token', authController.verifyToken.bind(authController));
router.post('/verifications/phonenumber', authController.verifyPhoneNumber.bind(authController));

export default router;
