"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupSchema = void 0;
const zod_1 = require("zod");
// Define the Signup validation schema 
exports.SignupSchema = zod_1.z.object({
    first_name: zod_1.z.string().min(2, 'First name must be at least 2 characters long'),
    last_name: zod_1.z.string().min(2, 'Last name must be at least 2 characters long'),
    phone_number: zod_1.z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
});
