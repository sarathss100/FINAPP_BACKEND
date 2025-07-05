import { Router } from 'express';
import NotificationManagementRepository from 'repositories/notifications/NotificaitonRepository';
import NotificationService from 'services/notification/NotificationService';
import NotificationController from 'controller/notification/NotificationController';

const router = Router();
const notificationRepository = new NotificationManagementRepository();
const notificationService = new NotificationService(notificationRepository);
const notificatonController = new NotificationController(notificationService);

router.post('/', notificatonController.createNotification.bind(notificatonController));

export default router;