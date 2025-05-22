import { z } from 'zod';

// Define the Zod Schema for Notification DTO
const notificationDTOSchema = z.object({
    user_id: z.string(),
    message: z.string(),
    isSeen: z.boolean().optional(),
    is_completed: z.boolean().optional(),
    reminder_frequency: z.string(),
    next_reminder_date: z.string(),
    priority_level: z.string(),
    target_date: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

// Infer the TS type from the Zod schema
export type INotificationDTO = z.infer<typeof notificationDTOSchema>

// Export the schema for reuse in other parts of the application
export default notificationDTOSchema;
