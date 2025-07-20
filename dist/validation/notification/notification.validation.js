"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const INotificaiton_1 = require("model/notification/interfaces/INotificaiton");
const zod_1 = require("zod");
// Create a Zod enum schema from the array
const notificationTypeEnum = zod_1.z.enum(INotificaiton_1.NOTIFICATION_TYPES);
// Define the Zod schema to match the INotification interface
const notificationDTOSchema = zod_1.z.object({
    user_id: zod_1.z.string({ required_error: 'User ID is required' }).optional(),
    title: zod_1.z.string({ required_error: 'Title is required' }),
    message: zod_1.z.string({ required_error: 'Message is required' }),
    type: notificationTypeEnum,
    is_read: zod_1.z.boolean().default(false),
    meta: zod_1.z.union([zod_1.z.string(), zod_1.z.record(zod_1.z.any())]).optional(),
    archived: zod_1.z.boolean().default(false),
});
// Export both the type for reuse
exports.default = notificationDTOSchema;
