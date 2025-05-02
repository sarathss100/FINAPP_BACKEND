import { Request, Response } from 'express';

interface INotificationController {
    createNotification(request: Request, response: Response): Promise<void>;
}

export default INotificationController;
