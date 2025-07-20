"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketListeners = void 0;
const eventBus_1 = require("events/eventBus");
const socket_server_1 = require("sockets/socket.server");
const setupSocketListeners = function () {
    // Notifications
    eventBus_1.eventBus.on('notification_created', (createdNotification) => {
        socket_server_1.io.of('/notification').to(`user_${createdNotification.user_id}`).emit('new_notification', createdNotification);
    });
    // Accounts
    eventBus_1.eventBus.on('account_created', (createdAccount) => {
        try {
            socket_server_1.io.of('/accounts').to(`user_${createdAccount.user_id}`).emit('new_account_created', createdAccount);
        }
        catch (error) {
            console.error('Error emitting account_created:', error);
        }
    });
    eventBus_1.eventBus.on('account_removed', (account) => {
        try {
            socket_server_1.io.of('/accounts').to(`user_${account.user_id}`).emit('account_deleted', account);
        }
        catch (error) {
            console.error('Error emitting account_deleted:', error);
        }
    });
    eventBus_1.eventBus.on('account_updated', (account) => {
        try {
            socket_server_1.io.of('/accounts').to(`user_${account.user_id}`).emit('account_updated', account);
        }
        catch (error) {
            console.error('Error emitting account_updated:', error);
        }
    });
    // Goals
    eventBus_1.eventBus.on('goal_created', (createdGoal) => {
        try {
            socket_server_1.io.of('/goals').to(`user_${createdGoal.user_id}`).emit('new_goal_created', createdGoal);
        }
        catch (error) {
            console.error('Error emitting goal_created:', error);
        }
    });
    eventBus_1.eventBus.on('goal_updated', (goal) => {
        try {
            socket_server_1.io.of('/goals').to(`user_${goal.user_id}`).emit('goal_updated', goal);
        }
        catch (error) {
            console.error('Error emitting goal_updated:', error);
        }
    });
    eventBus_1.eventBus.on('goal_removed', (goal) => {
        try {
            socket_server_1.io.of('/goals').to(`user_${goal.user_id}`).emit('goal_removed', goal);
        }
        catch (error) {
            console.error('Error emitting goal_removed:', error);
        }
    });
    // Debts
    eventBus_1.eventBus.on('debt_created', (debt) => {
        try {
            socket_server_1.io.of('/debts').to(`user_${debt.userId}`).emit('debt_created', debt);
        }
        catch (error) {
            console.error('Error emitting debt_created:', error);
        }
    });
    eventBus_1.eventBus.on('debt_removed', (debt) => {
        try {
            socket_server_1.io.of('/debts').to(`user_${debt.userId}`).emit('debt_removed', debt);
        }
        catch (error) {
            console.error('Error emitting debt_removed:', error);
        }
    });
    // Insurances
    eventBus_1.eventBus.on('insurance_created', (insurance) => {
        try {
            socket_server_1.io.of('/insurances').to(`user_${insurance.userId}`).emit('insurance_created', insurance);
        }
        catch (error) {
            console.error('Error emitting insurance_created:', error);
        }
    });
    eventBus_1.eventBus.on('insurance_removed', (insurance) => {
        try {
            socket_server_1.io.of('/insurances').to(`user_${insurance.userId}`).emit('insurance_removed', insurance);
        }
        catch (error) {
            console.error('Error emitting insurance_removed:', error);
        }
    });
    eventBus_1.eventBus.on('insurance_paid', (insurance) => {
        try {
            socket_server_1.io.of('/insurances').to(`user_${insurance.userId}`).emit('insurance_paid', insurance);
        }
        catch (error) {
            console.error('Error emitting insurance_paid:', error);
        }
    });
    // Investments
    eventBus_1.eventBus.on('investment_created', (investment) => {
        try {
            socket_server_1.io.of('/investments').to(`user_${investment.userId}`).emit('investment_created', investment);
        }
        catch (error) {
            console.error('Error emitting investment_created:', error);
        }
    });
    eventBus_1.eventBus.on('investment_removed', (investment) => {
        try {
            socket_server_1.io.of('/investments').to(`user_${investment.userId}`).emit('investment_removed', investment);
        }
        catch (error) {
            console.error('Error emitting investment_removed:', error);
        }
    });
    // Transactions
    eventBus_1.eventBus.on('transaction_created', (userId) => {
        try {
            socket_server_1.io.of('/transactions').to(`user_${userId}`).emit('transaction_created');
        }
        catch (error) {
            console.error('Error emitting transaction_created:', error);
        }
    });
};
exports.setupSocketListeners = setupSocketListeners;
