import { Router } from 'express';
import INotificationController from 'controller/notification/interfaces/INotificationController';

const createNotificationRouter = function(notificationController: INotificationController): Router {
    const router = Router();

    router.post('/', notificationController.createNotification.bind(notificationController));
    router.get('/', notificationController.getNotifications.bind(notificationController));
    router.patch('/archieve/:notificationId', notificationController.updateArchieveStatus.bind(notificationController));
    router.patch('/seen/all', notificationController.updateReadStatusAll.bind(notificationController));
    router.patch('/seen/:notificationId', notificationController.updateReadStatus.bind(notificationController));

    return router;
};

export default createNotificationRouter;