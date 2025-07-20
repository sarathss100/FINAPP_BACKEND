"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const faqQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .default('1')
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val) && val >= 1, {
        message: 'Pagination must be a positive integer',
    }),
    limit: zod_1.z
        .string()
        .optional()
        .default('10')
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val) && val >= 1, {
        message: 'Limit must be a positive integer',
    }),
    search: zod_1.z.string().optional().default('')
});
exports.default = faqQuerySchema;
