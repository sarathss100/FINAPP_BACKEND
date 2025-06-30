"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Define the Zod Schema for Notification DTO
const notificationDTOSchema = zod_1.z.object({
    user_id: zod_1.z.string(),
    message: zod_1.z.string(),
    isSeen: zod_1.z.boolean().optional(),
    is_completed: zod_1.z.boolean().optional(),
    reminder_frequency: zod_1.z.string(),
    next_reminder_date: zod_1.z.string(),
    priority_level: zod_1.z.string(),
    target_date: zod_1.z.string(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional(),
});
// Export the schema for reuse in other parts of the application
exports.default = notificationDTOSchema;
