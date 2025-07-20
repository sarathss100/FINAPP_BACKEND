"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNamespaces = setupNamespaces;
const NotificationService_1 = __importDefault(require("services/notification/NotificationService"));
const accounts_handler_1 = __importDefault(require("sockets/handlers/accounts.handler"));
const admin_handler_1 = __importDefault(require("sockets/handlers/admin.handler"));
const chat_handler_1 = __importDefault(require("sockets/handlers/chat.handler"));
const debts_handler_1 = __importDefault(require("sockets/handlers/debts.handler"));
const goals_handler_1 = __importDefault(require("sockets/handlers/goals.handler"));
const insurances_handler_1 = __importDefault(require("sockets/handlers/insurances.handler"));
const investments_handler_1 = __importDefault(require("sockets/handlers/investments.handler"));
const notification_handler_1 = __importDefault(require("sockets/handlers/notification.handler"));
const transactions_handler_1 = __importDefault(require("sockets/handlers/transactions.handler"));
const auth_middleware_1 = require("sockets/middleware/auth.middleware");
function setupNamespaces(io) {
    // Chat Namespace
    const chatNamespace = io.of('/chat');
    chatNamespace.use(auth_middleware_1.authenticate);
    chatNamespace.on('connection', (socket) => {
        (0, chat_handler_1.default)(socket, io);
    });
    // Notification Namespace
    const notificationNamespace = io.of('/notification');
    notificationNamespace.use(auth_middleware_1.authenticate);
    notificationNamespace.on('connection', (socket) => {
        const notificationService = NotificationService_1.default.instance;
        (0, notification_handler_1.default)(io, socket, notificationService);
    });
    // Admin Namespace
    const adminNamespace = io.of('/admin');
    adminNamespace.use(auth_middleware_1.authenticate);
    adminNamespace.on('connection', (socket) => {
        (0, admin_handler_1.default)(socket, io);
    });
    // Accounts Namespace
    const accountsNamespace = io.of('/accounts');
    accountsNamespace.use(auth_middleware_1.authenticate);
    accountsNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Account Socket ${socket.id} auto-joined room: ${roomName}`);
        (0, accounts_handler_1.default)(io, socket);
    });
    // Goal Namespace
    const goalsNamespace = io.of('/goals');
    goalsNamespace.use(auth_middleware_1.authenticate);
    goalsNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Goal Socket ${socket.id} auto-joined room: ${roomName}`);
        (0, goals_handler_1.default)(io, socket);
    });
    // Debt Namespace
    const debtsNamespace = io.of('/debts');
    debtsNamespace.use(auth_middleware_1.authenticate);
    debtsNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Debt Socket ${socket.id} auto-joined room: ${roomName}`);
        (0, debts_handler_1.default)(io, socket);
    });
    // Insurances Namespace
    const insurancesNamespace = io.of('/insurances');
    insurancesNamespace.use(auth_middleware_1.authenticate);
    insurancesNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Insurance Socket ${socket.id} auto-joined room: ${roomName}`);
        (0, insurances_handler_1.default)(io, socket);
    });
    // Investment Namespace
    const investmentNamespace = io.of('/investments');
    investmentNamespace.use(auth_middleware_1.authenticate);
    investmentNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Investment Socket ${socket.id} auto-joined room: ${roomName}`);
        (0, investments_handler_1.default)(io, socket);
    });
    // Transaction Namespace
    const transactionsNamespace = io.of('/transactions');
    transactionsNamespace.use(auth_middleware_1.authenticate);
    transactionsNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Transaction Socket ${socket.id} auto-joined room: ${roomName}`);
        (0, transactions_handler_1.default)(io, socket);
    });
}
;
