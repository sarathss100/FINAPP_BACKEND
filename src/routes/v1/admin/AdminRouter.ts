import AdminController from 'controller/admin/AdminController';
import IAdminController from 'controller/admin/interfaces/IAdminController';
import { Router } from 'express';
import AdminRepository from 'repositories/admin/AdminRepository';
import AdminService from 'services/admin/AdminService';

const router = Router();
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController: IAdminController = new AdminController(adminService);

router.get('/users', adminController.getAllUsers.bind(adminController));
router.post('/users/status', adminController.toggleUserStatus.bind(adminController));
router.post('/faqs', adminController.addFaq.bind(adminController));
router.get('/faqs', adminController.getAllFaqs.bind(adminController));
router.get('/analytics/registrations', adminController.getNewRegistrationCount.bind(adminController));
router.get('/health', adminController.getHealthStatus.bind(adminController));
router.get('/metrics', adminController.getSystemMetrics.bind(adminController));

export default router;
