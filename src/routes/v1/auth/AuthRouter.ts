import { Router } from 'express';
import IAuthController from 'controller/auth/ineterfaces/IAuthController';

const createAuthRouter = function(authController: IAuthController): Router {
    const router = Router();

    router.post('/signup', authController.signup.bind(authController));
    router.post('/signin', authController.signin.bind(authController));
    router.post('/signout', authController.signout.bind(authController));
    router.post('/password', authController.resetPassword.bind(authController));
    router.post('/verifications/token', authController.verifyToken.bind(authController));
    router.post('/verifications/phonenumber', authController.verifyPhoneNumber.bind(authController));

    return router;
};

export default createAuthRouter;