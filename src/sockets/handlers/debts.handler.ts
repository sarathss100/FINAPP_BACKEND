import DebtService from 'services/debt/DebtService';
import { Socket, Server } from 'socket.io';

const debtsService = DebtService.instance;

const registerDebtsHandlers = function(io: Server, socket: Socket): void {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;

    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Debt Socket ${socket.id} joined room: ${roomName}`);
        } 

        socket.on('request_all_debts', async () => {
            try {
                const debts = await debtsService.getAllDebts(accessToken);
                io.of('/debts').to(`user_${userId}`).emit('all_debts', [...debts]);
            } catch (error) {
                console.error(`Error fetch debts:`, error);

                if (error instanceof Error && error.message.includes('Failed to fetch debts for repayment strategy')) {
                    io.of('/debts').to(`user_${userId}`).emit('all_debts', []);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch all goals',
                        type: 'goal_error',
                    })
                }
            }
        });

        socket.on('request_total_debt', async () => {
            try {
                const totalDebt = await debtsService.getTotalDebt(accessToken);
                io.of('/debts').to(`user_${userId}`).emit('total_debt', totalDebt);
            } catch (error) {
                console.error(`Error fetch total debt:`, error);

                if (error instanceof Error && error.message.includes('Failed to calculate outstanding debt')) {
                    io.of('/debts').to(`user_${userId}`).emit('total_debt', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total debt',
                        type: 'total_debt_error',
                    })
                }
            }
        });

        socket.on('request_total_outstanding_debt', async () => {
            try {
                const totalOutstandingDebt = await debtsService.getTotalOutstandingDebt(accessToken);
                io.of('/debts').to(`user_${userId}`).emit('total_outstanding_debt', totalOutstandingDebt);
            } catch (error) {
                console.error(`Error fetch total outstanding debt:`, error);

                if (error instanceof Error && error.message.includes('Failed to calculate outstanding debt')) {
                    io.of('/debts').to(`user_${userId}`).emit('total_outstanding_debt', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total outstanding debt',
                        type: 'total_outstanding_debt_error',
                    })
                }
            }
        });

        socket.on('request_total_monthly_payment', async () => {
            try {
                const totalMonthlyPayment = await debtsService.getTotalMonthlyPayment(accessToken);
                io.of('/debts').to(`user_${userId}`).emit('total_monthly_payment', totalMonthlyPayment);
            } catch (error) {
                console.error(`Error fetch total monthly payment:`, error);

                if (error instanceof Error && error.message.includes('Failed to calculate total monthly payment')) {
                    io.of('/debts').to(`user_${userId}`).emit('total_monthly_payment', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total monthly payment',
                        type: 'total_monthly_payment_error',
                    })
                }
            }
        });

        socket.on('request_longest_debt_duration', async () => {
            try {
                const totalDebtDuration = await debtsService.getLongestTenure(accessToken);
                io.of('/debts').to(`user_${userId}`).emit('longest_debt_duration', totalDebtDuration);
            } catch (error) {
                console.error(`Error fetch longest debt duration:`, error);

                if (error instanceof Error && error.message.includes('Failed to calculate total monthly payment')) {
                    io.of('/debts').to(`user_${userId}`).emit('longest_debt_duration', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch longest debt duration',
                        type: 'longest_debt_duration_error',
                    })
                }
            }
        });

        socket.on('request_good_debts', async () => {
            try {
                const goodDebts = await debtsService.getDebtCategorized(accessToken, 'good');
                io.of('/debts').to(`user_${userId}`).emit('good_debts', goodDebts);
            } catch (error) {
                console.error(`Error fetch good debts:`, error);

                if (error instanceof Error && error.message.includes('Failed to fetch categorized debts')) {
                    io.of('/debts').to(`user_${userId}`).emit('good_debts', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch good debts',
                        type: 'good_debts_error',
                    })
                }
            }
        });

        socket.on('request_bad_debts', async () => {
            try {
                const badDebts = await debtsService.getDebtCategorized(accessToken, 'bad');
                io.of('/debts').to(`user_${userId}`).emit('bad_debts', badDebts);
            } catch (error) {
                console.error(`Error fetch bad debts:`, error);

                if (error instanceof Error && error.message.includes('Failed to fetch categorized debts')) {
                    io.of('/debts').to(`user_${userId}`).emit('bad_debts', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch bad debts',
                        type: 'bad_debts_error',
                    })
                }
            }
        });

        socket.on('request_repayment_simulation_results', async () => {
            try {
                const simulationResult = await debtsService.getRepaymentStrategyComparison(accessToken, 1000);
                io.of('/debts').to(`user_${userId}`).emit('repayment_simulation_results', simulationResult);
            } catch (error) {
                console.error(`Error fetch repayment simulation results:`, error);

                if (error instanceof Error && error.message.includes('Failed to fetch debts for repayment strategy')) {
                    io.of('/debts').to(`user_${userId}`).emit('repayment_simulation_results', { 
                        snowball: {
                            totalMonths: 0,
                            totalInterestPaid: 0,
                            totalMonthlyPayment: 0,
                        },
                        avalanche: {
                            totalMonths: 0,
                            totalInterestPaid: 0,
                            totalMonthlyPayment: 0,
                        }
                    });
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch repayment simulation results',
                        type: 'repayment_simulation_results_error',
                    })
                }
            }
        });

        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Debt Socket ${socket.id} disconnected`);
        });

    } catch (error) {
        console.error('Error in registerDebtsHandlers:', error);
        socket.emit('error', {
            message: 'Failed to initialize debt handlers',
            type: 'initialization_error'
        });      
    }
};

export default registerDebtsHandlers;