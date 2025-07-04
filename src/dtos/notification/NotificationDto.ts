/**
 * DTO for Notification entity
 */
export interface INotificationDTO {
    user_id: string; // Required
    message: string; // Required
    isSeen?: boolean;
    is_completed?: boolean;
    reminder_frequency: string; // Required
    next_reminder_date: string; // Required (ISO date string)
    priority_level: string; // Required
    target_date: string; // Required (ISO date string)
    createdAt?: string; // Optional ISO date string
    updatedAt?: string; // Optional ISO date string
}