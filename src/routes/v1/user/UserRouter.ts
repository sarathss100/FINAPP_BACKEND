import { Router } from 'express';
import UserRepository from '../../../repositories/user/UserRepository';
import UserService from '../../../services/user/UserService';
import UserController from '../../../controller/user/UserController';
import IUserController from '../../../controller/user/interfaces/IUserController';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const createUserRouter = function(userController: IUserController): Router {
    const router = Router(); 

    router.get('/me', userController.getUserProfileDetails.bind(userController));
    router.get('/me/avatar', userController.getUserProfilePictureUrl.bind(userController));
    router.post('/me/avatar', upload.single('file'), userController.uploadProfilePicture.bind(userController));
    router.patch('/two-factor', userController.toggleTwoFactorAuthentication.bind(userController));
    router.delete('/me', userController.deleteUserAccount.bind(userController));
    router.get('/images/:imageId', userController.serveProfileImage.bind(userController));

    return router;
};

export default createUserRouter;
