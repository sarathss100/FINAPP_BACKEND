import { Router } from 'express';
import PublicRepository from '../../../repositories/public/PublicRepository';
import PublicService from '../../../services/public/PublicService';
import IPublicController from '../../../controller/public/interfaces/IPublicController';
import PublicController from '../../../controller/public/publicController';

const createPublicRouter = function(publicController: IPublicController): Router {
    const router = Router();

    router.get('/faq', publicController.getFaqs.bind(publicController));

    return router;
};

export default createPublicRouter;
