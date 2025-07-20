"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
};
exports.default = corsOptions;
