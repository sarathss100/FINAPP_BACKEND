import { Router } from 'express';
import AuthService from 'services/auth/AuthService';
import AuthController from 'controller/auth/AuthController';
import UserRepository from 'repositories/auth/ UserRepository';
import BcryptHasher from 'utils/hash';

const router = Router();
const userRepository = new UserRepository();
const hasher = new BcryptHasher();
const authService = new AuthService(userRepository, hasher);
const authController = new AuthController(authService);

router.post('/signup', authController.signup.bind(authController));

export default router;
