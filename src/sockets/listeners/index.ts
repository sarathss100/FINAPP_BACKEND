import { eventBus } from "events/eventBus";
import { io } from "sockets/socket.server";

export const setupSocketListeners = function() {

    // Notifications
    eventBus.on('notification_created', (createdNotification) => {
        io.of('/notification').to(`user_${createdNotification.user_id}`).emit('new_notification', createdNotification);
    });

    // Accounts
    eventBus.on('account_created', (createdAccount) => {
        try {
            io.of('/accounts').to(`user_${createdAccount.user_id}`).emit('new_account_created', createdAccount);
        } catch (error) {
            console.error('Error emitting account_created:', error);
        }
    });

    eventBus.on('account_removed', (account) => {
        try {
            io.of('/accounts').to(`user_${account.user_id}`).emit('account_deleted', account);
        } catch (error) {
            console.error('Error emitting account_deleted:', error);
        }
    });

    eventBus.on('account_updated', (account) => {
        try {
            io.of('/accounts').to(`user_${account.user_id}`).emit('account_updated', account);
        } catch (error) {
            console.error('Error emitting account_updated:', error);
        }
    });

    // Goals
    eventBus.on('goal_created', (createdGoal) => {
        try {
            io.of('/goals').to(`user_${createdGoal.user_id}`).emit('new_goal_created', createdGoal);
        } catch (error) {
            console.error('Error emitting goal_created:', error);
        }
    });

    eventBus.on('goal_updated', (goal) => {
        try {
            io.of('/goals').to(`user_${goal.user_id}`).emit('goal_updated', goal);
        } catch (error) {
            console.error('Error emitting goal_updated:', error);
        }
    });

    eventBus.on('goal_removed', (goal) => {
        try {
            io.of('/goals').to(`user_${goal.user_id}`).emit('goal_removed', goal);
        } catch (error) {
            console.error('Error emitting goal_removed:', error);
        }
    });

    // Debts
    eventBus.on('debt_created', (debt) => {
        try {
            io.of('/debts').to(`user_${debt.userId}`).emit('debt_created', debt);
        } catch (error) {
            console.error('Error emitting debt_created:', error);
        }
    });

    eventBus.on('debt_removed', (debt) => {
        try {
            io.of('/debts').to(`user_${debt.userId}`).emit('debt_removed', debt);
        } catch (error) {
            console.error('Error emitting debt_removed:', error);
        }
    });

    // Insurances
    eventBus.on('insurance_created', (insurance) => {
        try {
            io.of('/insurances').to(`user_${insurance.userId}`).emit('insurance_created', insurance);
        } catch (error) {
            console.error('Error emitting insurance_created:', error);
        }
    });

    eventBus.on('insurance_removed', (insurance) => {
        try {
            io.of('/insurances').to(`user_${insurance.userId}`).emit('insurance_removed', insurance);
        } catch (error) {
            console.error('Error emitting insurance_removed:', error);
        }
    });

    eventBus.on('insurance_paid', (insurance) => {
        try {
            io.of('/insurances').to(`user_${insurance.userId}`).emit('insurance_paid', insurance);
        } catch (error) {
            console.error('Error emitting insurance_paid:', error);
        }
    });
};