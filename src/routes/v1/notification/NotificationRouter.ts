import { Router } from 'express';
import NotificationManagementRepository from '../../../repositories/notifications/NotificaitonRepository';
import NotificationService from '../../../services/notification/NotificationService';
import NotificationController from '../../../controller/notification/NotificationController';
import INotificationController from '../../../controller/notification/interfaces/INotificationController';

const router = Router();
const notificationRepository = new NotificationManagementRepository();
const notificationService = new NotificationService(notificationRepository);
const notificatonController:INotificationController = new NotificationController(notificationService);

router.post('/', notificatonController.createNotification.bind(notificatonController));
router.get('/', notificatonController.getNotifications.bind(notificatonController));
router.patch('/archieve/:notificationId', notificatonController.updateArchieveStatus.bind(notificatonController));
router.patch('/seen/all', notificatonController.updateReadStatusAll.bind(notificatonController));
router.patch('/seen/:notificationId', notificatonController.updateReadStatus.bind(notificatonController));

export default router;