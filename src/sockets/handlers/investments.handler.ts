import InvestmentService from 'services/investments/InvestmentService';
import { Socket, Server } from 'socket.io';

const investmentService = InvestmentService.instance;

const registerInvestmentsHandlers = function(io: Server, socket: Socket): void {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;

    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Investment Socket ${socket.id} joined room: ${roomName}`);
        } 

        socket.on('request_all_investments', async () => {
            try {
                const investments = await investmentService.getCategorizedInvestments(accessToken);
                io.of('/investments').to(`user_${userId}`).emit('all_investments', investments);
            } catch (error) {
                console.error(`Error fetch all_investments:`, error);

                if (error instanceof Error && error.message.includes('Failed to fetch and categorize investments')) {
                    io.of('/investments').to(`user_${userId}`).emit('all_investments', {
                        "STOCK": [],
                        "BOND": [],
                        "BUSINESS": [],
                        "EPFO": [],
                        "FIXED_DEPOSIT": [],
                        "GOLD": [],
                        "MUTUAL_FUND": [],
                        "PROPERTY": [],
                        "PARKING_FUND": [],
                    });
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch all investments',
                        type: 'investment_error',
                    })
                }
            }
        });

        socket.on('request_total_invested_amount', async () => {
            try {
                const totalInvestedAmount = await investmentService.totalInvestment(accessToken);
                io.of('/investments').to(`user_${userId}`).emit('total_invested_amount', totalInvestedAmount);
            } catch (error) {
                console.error(`Error fetch total invested amount:`, error);

                if (error instanceof Error && error.message.includes('Failed to calculate total investment')) {
                    io.of('/investments').to(`user_${userId}`).emit('total_invested_amount', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total invested amount',
                        type: 'investments_error',
                    })
                }
            }
        });

        socket.on('request_current_valuation', async () => {
            try {
                const totalCurrentValuation = await investmentService.currentTotalValue(accessToken);
                io.of('/investments').to(`user_${userId}`).emit('current_valuation', totalCurrentValuation);
            } catch (error) {
                console.error(`Error fetch current valuation:`, error);

                if (error instanceof Error && error.message.includes('Failed to calculate current total value')) {
                    io.of('/investments').to(`user_${userId}`).emit('current_valuation', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch current valuation',
                        type: 'investments_error',
                    })
                }
            }
        });

        socket.on('request_total_returns', async () => {
            try {
                const totalReturns = await investmentService.getTotalReturns(accessToken);
                io.of('/investments').to(`user_${userId}`).emit('total_returns', totalReturns);
            } catch (error) {
                console.error(`Error fetch total Returns:`, error);

                if (error instanceof Error && error.message.includes('Failed to calculate total returns')) {
                    io.of('/investments').to(`user_${userId}`).emit('total_returns', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total returns',
                        type: 'investments_error',
                    })
                }
            }
        });

        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Investment Socket ${socket.id} disconnected`);
        });

    } catch (error) {
        console.error('Error in registerInvestmentsHandlers:', error);
        socket.emit('error', {
            message: 'Failed to initialize Investments handlers',
            type: 'connect_error'
        });      
    }
};

export default registerInvestmentsHandlers;