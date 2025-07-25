import { Router } from 'express';
import PublicRepository from '../../../repositories/public/PublicRepository';
import PublicService from '../../../services/public/PublicService';
import IPublicController from '../../../controller/public/interfaces/IPublicController';
import PublicController from '../../../controller/public/publicController';

const router = Router();
const publicRepository = new PublicRepository();
const publicService = new PublicService(publicRepository);
const publicController: IPublicController = new PublicController(publicService);

router.get('/faq', publicController.getFaqs.bind(publicController));

export default router;
