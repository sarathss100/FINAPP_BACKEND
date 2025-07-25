import NotificationManagementRepository from 'repositories/notifications/NotificaitonRepository';
import NotificationService from 'services/notification/NotificationService';
import NotificationController from 'controller/notification/NotificationController';
import INotificationController from 'controller/notification/interfaces/INotificationController';
import createNotificationRouter from './NotificationRouter';

class NotificationContainer {
    public readonly controller: INotificationController;
    public readonly router: ReturnType<typeof createNotificationRouter>;

    constructor() {
        const repository = new NotificationManagementRepository();
        const service = new NotificationService(repository);
        this.controller = new NotificationController(service);
        this.router = createNotificationRouter(this.controller);
    }
}

export default NotificationContainer;