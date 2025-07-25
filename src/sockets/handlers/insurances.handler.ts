import InsuranceService from '../../services/insurances/InsuranceService';
import { Socket, Server } from 'socket.io';

const insuranceService = InsuranceService.instance;

const registerInsurancesHandlers = function(io: Server, socket: Socket): void {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;

    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Insurance Socket ${socket.id} joined room: ${roomName}`);
        } 

        socket.on('request_all_insurances', async () => {
            try {
                const insurances = await insuranceService.getAllInsurances(accessToken);
                io.of('/insurances').to(`user_${userId}`).emit('all_insurances', [...insurances]);
            } catch (error) {
                console.error(`Error fetch all insurances:`, error);

                if (error instanceof Error && error.message.includes('Failed to fetch insurance records')) {
                    io.of('/insurances').to(`user_${userId}`).emit('all_insurances', []);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch all insurances',
                        type: 'insurance_error',
                    })
                }
            }
        });

        socket.on('request_total_insurance_coverage', async () => {
            try {
                const totalInsuranceCoverage = await insuranceService.getUserInsuranceCoverageTotal(accessToken);
                io.of('/insurances').to(`user_${userId}`).emit('total_insurance_coverage', totalInsuranceCoverage);
            } catch (error) {
                console.error(`Error fetch total insurance coverage:`, error);

                if (error instanceof Error && error.message.includes('Failed to calculate total insurance coverage')) {
                    io.of('/insurances').to(`user_${userId}`).emit('total_insurance_coverage', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total insurance coverage',
                        type: 'insurance_error',
                    })
                }
            }
        });

        socket.on('request_total_annual_insurance_premium', async () => {
            try {
                const totalAnnualInsurancePremium = await insuranceService.getUserTotalPremiumAmount(accessToken);
                io.of('/insurances').to(`user_${userId}`).emit('total_annual_insurance_premium', totalAnnualInsurancePremium);
            } catch (error) {
                console.error(`Error fetch total annual insurance premium:`, error);

                if (error instanceof Error && error.message.includes('Failed to calculate insurance annual premium')) {
                    io.of('/insurances').to(`user_${userId}`).emit('total_annual_insurance_premium', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total_annual_insurance_premium',
                        type: 'insurance_error',
                    })
                }
            }
        });

        socket.on('request_next_payment_date', async () => {
            try {
                const nextPaymentDate = await insuranceService.getClosestNextPaymentDate(accessToken);
                io.of('/insurances').to(`user_${userId}`).emit('next_payment_date', nextPaymentDate);
            } catch (error) {
                console.error(`Error fetch next payment date:`, error);

                if (error instanceof Error && error.message.includes('Failed to fetch closest next payment insurance')) {
                    io.of('/insurances').to(`user_${userId}`).emit('next_payment_date', {
                        _id: '',
                        userId: '',
                        type: '',
                        coverage: 0,
                        premium: 0,
                        next_payment_date: new Date(),
                        payment_status: '',
                        status: '',
                    });
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch next payment date',
                        type: 'insurance_error',
                    })
                }
            }
        });

        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Insurance Socket ${socket.id} disconnected`);
        });

    } catch (error) {
        console.error('Error in registerInsurancesHandlers:', error);
        socket.emit('error', {
            message: 'Failed to initialize Insurance handlers',
            type: 'connect_error'
        });      
    }
};

export default registerInsurancesHandlers;