import AccountsService from '../../services/accounts/AccountService';
import { Socket, Server } from 'socket.io';

const accountsService = AccountsService.instance;

const registerAccountsHandlers = function(io: Server, socket: Socket): void {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;

    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Account Socket ${socket.id} joined room: ${roomName}`);
        } 

        socket.on('request_balance_update', async () => {
            try {
                const totalBalance = await accountsService.getTotalBalance(accessToken);
                const totalBankBalance = await accountsService.getTotalBankBalance(accessToken);
                const totalDebt = await accountsService.getTotalDebt(accessToken);
                const totalInvestment = await accountsService.getTotalInvestment(accessToken);
                
                io.of('/accounts').to(`user_${userId}`).emit('balance_update', { 
                    totalBalance,
                    totalBankBalance,
                    totalDebt,
                    totalInvestment
                });
            } catch (error) {
                console.error('Error fetching balance update:', error);
                
                // Check if it's a "no accounts" error and handle gracefully
                if (error instanceof Error && error.message.includes('No accounts found')) {
                    // Send default/empty balance data for fresh users
                    io.of('/accounts').to(`user_${userId}`).emit('balance_update', { 
                        totalBalance: 0,
                        totalBankBalance: 0,
                        totalDebt: 0,
                        totalInvestment: 0
                    });
                } else {
                    // Send error to client instead of crashing server
                    socket.emit('error', {
                        message: 'Failed to fetch balance update',
                        type: 'balance_error'
                    });
                }
            }
        });

        socket.on('request_accounts_update', async () => {
            try {
                const accounts = await accountsService.getUserAccounts(accessToken);
                
                // Send the accounts data in the format expected by client
                // The client expects a Record<string, IAccount> format
                io.of('/accounts').to(`user_${userId}`).emit('accounts_update', accounts);
                
            } catch (error) {
                console.error('Error fetching accounts update:', error);
                
                // Check if it's a "no accounts" error and handle gracefully
                if (error instanceof Error && error.message.includes('No accounts found')) {
                    // Send empty accounts data for fresh users
                    // Send as empty object (not array) to match expected format
                    io.of('/accounts').to(`user_${userId}`).emit('accounts_update', {});
                } else {
                    // Send error to client instead of crashing server
                    socket.emit('error', {
                        message: 'Failed to fetch accounts',
                        type: 'accounts_error'
                    });
                }
            }
        });

        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Account Socket ${socket.id} disconnected`);
        });

    } catch (error) {
        console.error('Error in registerAccountsHandlers:', error);
        socket.emit('error', {
            message: 'Failed to initialize account handlers',
            type: 'initialization_error'
        });      
    }
};

export default registerAccountsHandlers;