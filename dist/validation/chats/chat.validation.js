"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatDTOSchema = void 0;
const zod_1 = require("zod");
exports.chatDTOSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    userId: zod_1.z.string().min(1, { message: 'User ID is required' }).optional(),
    role: zod_1.z.union([zod_1.z.literal('user'), zod_1.z.literal('bot'), zod_1.z.literal('admin')], { message: "Role must be either 'user' or 'bot'" }).optional(),
    message: zod_1.z.string().min(1, { message: 'Message content is required' }).optional(),
    timestamp: zod_1.z.string()
        .refine(dateStr => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
    }, {
        message: 'Invalid timestamp format',
    })
        .transform(dateStr => new Date(dateStr)).optional(),
});
