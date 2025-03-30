import { Router } from 'express';
import AuthService from 'services/auth/AuthService';
import AuthController from 'controller/auth/AuthController';
import IAuthController from 'controller/auth/IAuthController';
import UserRepository from 'repositories/auth/ UserRepository';
import BcryptHasher from 'utils/hash';

const router = Router();
const userRepository = new UserRepository();
const hasher = new BcryptHasher();
const authService = new AuthService(userRepository, hasher);
const authController: IAuthController = new AuthController(authService);

router.post('/signup', authController.signup.bind(authController));
router.post('/signin', authController.signin.bind(authController));
router.post('/signout', authController.signout.bind(authController));
router.post('/change-password', authController.resetPassword.bind(authController));

// Verification Routes
router.post('/verify-token', authController.verifyToken.bind(authController));
router.post('/verify-phonenumber', authController.verifyPhoneNumber.bind(authController));

export default router;
