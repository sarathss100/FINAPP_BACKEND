import { Router } from 'express';
import UserRepository from 'repositories/user/UserRepository';
import UserService from 'services/user/UserService';
import UserController from 'controller/user/UserController';
import IUserController from 'controller/user/interfaces/IUserController';

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController: IUserController = new UserController(userService);

router.get('/profile', userController.getUserProfileDetails.bind(userController));

export default router;
