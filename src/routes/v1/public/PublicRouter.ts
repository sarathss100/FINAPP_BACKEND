import { Router } from 'express';
import IPublicController from 'controller/public/interfaces/IPublicController';

const createPublicRouter = function(publicController: IPublicController): Router {
    const router = Router();

    router.get('/faq', publicController.getFaqs.bind(publicController));

    return router;
};

export default createPublicRouter;
