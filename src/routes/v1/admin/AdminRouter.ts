import IAdminController from '../../../controller/admin/interfaces/IAdminController';
import { Router } from 'express';

const createAdminRouter = function(adminController: IAdminController): Router {
    const router = Router();

    router.get('/users', adminController.getAllUsers.bind(adminController));
    router.post('/users/status', adminController.toggleUserStatus.bind(adminController));
    router.post('/faqs', adminController.addFaq.bind(adminController));
    router.delete('/faq/:id', adminController.deleteFaq.bind(adminController));
    router.patch('/faq/:id', adminController.togglePublish.bind(adminController));
    router.put('/faq/:id', adminController.updateFaq.bind(adminController));
    router.get('/faqs', adminController.getAllFaqs.bind(adminController));
    router.get('/faqs/all', adminController.getAllFaqsForAdmin.bind(adminController));
    router.get('/analytics/registrations', adminController.getNewRegistrationCount.bind(adminController));
    router.get('/health', adminController.getHealthStatus.bind(adminController));
    router.get('/metrics', adminController.getSystemMetrics.bind(adminController));

    return router;
};

export default createAdminRouter;