import { NotificationType } from "model/notification/interfaces/INotificaiton";

/**
 * DTO for Notification entity
 */
export interface INotificationDTO {
    _id?: string,
    user_id?: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    meta?: string | object;
    archived: boolean;
}


