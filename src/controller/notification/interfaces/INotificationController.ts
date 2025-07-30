import { Request, Response } from 'express';

export default interface INotificationController {
    createNotification(request: Request, response: Response): Promise<void>;
    getNotifications(request: Request, response: Response): Promise<void>;
    updateArchieveStatus(request: Request, response: Response): Promise<void>;
    updateReadStatus(request: Request, response: Response): Promise<void>;
    updateReadStatusAll(request: Request, response: Response): Promise<void>;
}
