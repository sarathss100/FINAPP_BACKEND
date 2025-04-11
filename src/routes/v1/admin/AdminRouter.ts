import AdminController from 'controller/admin/AdminController';
import IAdminController from 'controller/admin/interfaces/IAdminController';
import { Router } from 'express';
import AdminRepository from 'repositories/admin/AdminRepository';
import AdminService from 'services/admin/AdminService';

const router = Router();
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController: IAdminController = new AdminController(adminService);

router.get('/all-users', adminController.getAllUsers.bind(adminController));
router.post('/toggle-user-status', adminController.toggleUserStatus.bind(adminController));
router.post('/add-faq', adminController.addFaq.bind(adminController));
router.get('/faq', adminController.getAllFaqs.bind(adminController));

export default router;
