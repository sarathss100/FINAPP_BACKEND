import NotificationRepository from '../../../repositories/notifications/NotificaitonRepository';
import NotificationService from '../../../services/notification/NotificationService';
import NotificationController from '../../../controller/notification/NotificationController';
import INotificationController from '../../../controller/notification/interfaces/INotificationController';
import createNotificationRouter from './NotificationRouter';

export default class NotificationContainer {
    public readonly controller: INotificationController;
    public readonly router: ReturnType<typeof createNotificationRouter>;

    constructor() {
        const repository = new NotificationRepository();
        const service = new NotificationService(repository);
        this.controller = new NotificationController(service);
        this.router = createNotificationRouter(this.controller);
    }
}