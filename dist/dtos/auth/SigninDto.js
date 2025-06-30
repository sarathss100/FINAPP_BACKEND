"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninSchema = void 0;
const zod_1 = require("zod");
// Define the Signin validation schema 
exports.SigninSchema = zod_1.z.object({
    phone_number: zod_1.z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
});
