import TransactionService from '../../services/transaction/TransactionService';
import { Socket, Server } from 'socket.io';

const transactionService = TransactionService.instance;

const registerTransactionsHandlers = function(io: Server, socket: Socket): void {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;

    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Transaction Socket ${socket.id} joined room: ${roomName}`);
        } 

        socket.on('request_all_transactions', async () => {
            try {
                const transactions = await transactionService.getUserTransactions(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('all_transactions', transactions);
            } catch (error) {
                console.error(`Error fetch all transactions:`, error);

                if (error instanceof Error && error.message.includes('No transactions found for the specified user')) {
                    io.of('/transactions').to(`user_${userId}`).emit('all_transactions', []);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch all transactions',
                        type: 'transaction_error',
                    })
                }
            }
        });

        socket.on('request_all_expense_transactions', async () => {
            try {
                const allExpenseTransactions = await transactionService.getAllExpenseTransactionsByCategory(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('all_expense_transactions', allExpenseTransactions);
            } catch (error) {
                console.error(`Error fetch all expense transactions:`, error);

                if (error instanceof Error && error.message.includes('Error retrieving expense totals by category')) {
                    io.of('/transactions').to(`user_${userId}`).emit('all_expense_transactions', []);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch all expense transactions',
                        type: 'transaction_error',
                    })
                }
            }
        });

        socket.on('request_all_income_transactions', async () => {
            try {
                const allIncomeTransactions = await transactionService.getAllIncomeTransactionsByCategory(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('all_income_transactions', allIncomeTransactions);
            } catch (error) {
                console.error(`Error fetch all income transactions:`, error);

                if (error instanceof Error && error.message.includes('Error retrieving income totals by category')) {
                    io.of('/transactions').to(`user_${userId}`).emit('all_income_transactions', []);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch all income transactions',
                        type: 'transaction_error',
                    })
                }
            }
        });

        socket.on('request_monthly_income_trends', async () => {
            try {
                const monthlyIncomeTrends = await transactionService.getMonthlyIncomeForChart(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('monthly_income_trends', monthlyIncomeTrends);
            } catch (error) {
                console.error(`Error fetch all monthly income trends:`, error);

                if (error instanceof Error && error.message.includes('Error retrieving transaction details')) {
                    io.of('/transactions').to(`user_${userId}`).emit('monthly_income_trends', []);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch all monthly income trends',
                        type: 'transaction_error',
                    })
                }
            }
        });

        socket.on('request_monthly_expense_trends', async () => {
            try {
                const monthlyExpenseTrends = await transactionService.getMonthlyExpenseForChart(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('monthly_expense_trends', monthlyExpenseTrends);
            } catch (error) {
                console.error(`Error fetch all monthly expense trends:`, error);

                if (error instanceof Error && error.message.includes('Error retrieving monthly expense data')) {
                    io.of('/transactions').to(`user_${userId}`).emit('monthly_expense_trends', []);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch all monthly expense trends',
                        type: 'transaction_error',
                    })
                }
            }
        });

        socket.on('request_categorywise_monthly_expense', async () => {
            try {
                const categoryWiseMonthlyExpense = await transactionService.getCategoryWiseExpense(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('categorywise_monthly_expense', categoryWiseMonthlyExpense);
            } catch (error) {
                console.error(`Error fetch categorywise monthly expense:`, error);

                if (error instanceof Error && error.message.includes('Failed to retrieve monthly expense total')) {
                    io.of('/transactions').to(`user_${userId}`).emit('categorywise_monthly_expense', []);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch categorywise monthly expense',
                        type: 'transaction_error',
                    })
                }
            }
        });

        socket.on('request_current_month_total_expense', async () => {
            try {
                const currentMonthTotalExpense = await transactionService.getMonthlyTotalExpense(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('current_month_total_expense', currentMonthTotalExpense);
            } catch (error) {
                console.error(`Error fetch current month total expense:`, error);

                if (error instanceof Error && error.message.includes('Failed to retrieve monthly expense total')) {
                    io.of('/transactions').to(`user_${userId}`).emit('current_month_total_expense', { 
                        currentMonthExpenseTotal: 0, 
                        previousMonthExpenseTotal: 0, 
                    });
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch current month total expense',
                        type: 'transaction_error',
                    })
                }
            }
        });

        socket.on('request_current_month_total_income', async () => {
            try {
                const currentMonthTotalIncome = await transactionService.getMonthlyTotalIncome(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('current_month_total_income', currentMonthTotalIncome);
            } catch (error) {
                console.error(`Error fetch current month total income:`, error);

                if (error instanceof Error && error.message.includes('Error retrieving transaction details')) {
                    io.of('/transactions').to(`user_${userId}`).emit('current_month_total_income', {
                        currentMonthTotal: 0, 
                        previousMonthTotal: 0, 
                    });
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch current month total income',
                        type: 'transaction_error',
                    })
                }
            }
        });

        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Transaction Socket ${socket.id} disconnected`);
        });

    } catch (error) {
        console.error('Error in registerTransactionsHandlers:', error);
        socket.emit('error', {
            message: 'Failed to initialize Transaction handlers',
            type: 'connect_error'
        });      
    }
};

export default registerTransactionsHandlers;