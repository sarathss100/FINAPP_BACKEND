"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceDTOSchema = void 0;
const zod_1 = require("zod");
exports.insuranceDTOSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
    type: zod_1.z.string().min(1, { message: 'Type is required' }),
    coverage: zod_1.z.number().positive({ message: 'Coverage must be a positive number' }),
    premium: zod_1.z.number().positive({ message: 'Premium must be a positive number' }),
    next_payment_date: zod_1.z.string()
        .refine(dateStr => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
    }, {
        message: 'Invalid date value',
    })
        .transform(dateStr => new Date(dateStr)),
    payment_status: zod_1.z.string().min(1, { message: `Payment Status is Required` }),
    status: zod_1.z.string().min(1, { message: 'Status is required' }).optional(),
});
