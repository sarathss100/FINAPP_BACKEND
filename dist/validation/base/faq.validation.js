"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Define the Zod Schema for IFaq
const faqSchema = zod_1.z.object({
    question: zod_1.z.string().min(5, "Question must be at least 5 charcters.").max(255),
    answer: zod_1.z.string().min(10, "Answer must be at least 10 characters.").max(1000),
    isDeleted: zod_1.z.boolean().optional(),
    isPublished: zod_1.z.boolean().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional()
});
// Export the schema for reuse in other parts of the application
exports.default = faqSchema;
