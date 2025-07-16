import NotificationService from 'services/notification/NotificationService';
import { Server } from 'socket.io';
import registerAccountsHandlers from 'sockets/handlers/accounts.handler';
import registerAdminHandlers from 'sockets/handlers/admin.handler';
import registerChatHandlers from 'sockets/handlers/chat.handler';
import registerDebtsHandlers from 'sockets/handlers/debts.handler';
import registerGoalsHandlers from 'sockets/handlers/goals.handler';
import registerInsurancesHandlers from 'sockets/handlers/insurances.handler';
import registerInvestmentsHandlers from 'sockets/handlers/investments.handler';
import registerNotificationHandlers from 'sockets/handlers/notification.handler';
import { authenticate } from 'sockets/middleware/auth.middleware';

export function setupNamespaces(io: Server): void {
    // Chat Namespace
    const chatNamespace = io.of('/chat');
    chatNamespace.use(authenticate);
    chatNamespace.on('connection', (socket) => {
        registerChatHandlers(socket, io);
    });

    // Notification Namespace
    const notificationNamespace = io.of('/notification');
    notificationNamespace.use(authenticate);
    notificationNamespace.on('connection', (socket) => {
        const notificationService = NotificationService.instance;
        registerNotificationHandlers(io, socket, notificationService);
    });

    // Admin Namespace
    const adminNamespace = io.of('/admin');
    adminNamespace.use(authenticate);
    adminNamespace.on('connection', (socket) => {
        registerAdminHandlers(socket, io);
    });

    // Accounts Namespace
    const accountsNamespace = io.of('/accounts');
    accountsNamespace.use(authenticate);
    accountsNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Account Socket ${socket.id} auto-joined room: ${roomName}`);
        registerAccountsHandlers(io, socket);
    });

    // Goal Namespace
    const goalsNamespace = io.of('/goals');
    goalsNamespace.use(authenticate);
    goalsNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Goal Socket ${socket.id} auto-joined room: ${roomName}`);
        registerGoalsHandlers(io, socket);
    });

    // Debt Namespace
    const debtsNamespace = io.of('/debts');
    debtsNamespace.use(authenticate);
    debtsNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Debt Socket ${socket.id} auto-joined room: ${roomName}`);
        registerDebtsHandlers(io, socket);
    });

    // Insurances Namespace
    const insurancesNamespace = io.of('/insurances');
    insurancesNamespace.use(authenticate);
    insurancesNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Insurance Socket ${socket.id} auto-joined room: ${roomName}`);
        registerInsurancesHandlers(io, socket);
    });

    // Investment Namespace
    const investmentNamespace = io.of('/investments');
    investmentNamespace.use(authenticate);
    investmentNamespace.on('connection', (socket) => {
        const userId = socket.data.userId;
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Investment Socket ${socket.id} auto-joined room: ${roomName}`);
        registerInvestmentsHandlers(io, socket);
    });
}