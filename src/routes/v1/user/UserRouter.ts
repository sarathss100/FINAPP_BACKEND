import { Router } from 'express';
import UserRepository from 'repositories/user/UserRepository';
import UserService from 'services/user/UserService';
import UserController from 'controller/user/UserController';
import IUserController from 'controller/user/interfaces/IUserController';
import multer from 'multer';

// Initialize Multer with the in Memory Storage
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController: IUserController = new UserController(userService);

router.get('/profile', userController.getUserProfileDetails.bind(userController));
router.get('/profile/profile-picture', userController.getUserProfilePictureUrl.bind(userController));
router.post('/profile/profile-picture', upload.single('file'), userController.uploadProfilePicture.bind(userController));
router.post('/profile/toggle-2FA', userController.toggleTwoFactorAuthentication.bind(userController));
router.delete('/profile/delete', userController.deleteUserAccount.bind(userController));

export default router;
