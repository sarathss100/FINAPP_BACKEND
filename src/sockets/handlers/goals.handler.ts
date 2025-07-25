import GoalService from '../../services/goal/GoalService';
import { Socket, Server } from 'socket.io';

const goalsService = GoalService.instance;

const registerGoalsHandlers = function(io: Server, socket: Socket): void {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;

    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Goal Socket ${socket.id} joined room: ${roomName}`);
        } 

        socket.on('request_all_goals', async () => {
            try {
                const goals = await goalsService.getUserGoals(accessToken);
                io.of('/goals').to(`user_${userId}`).emit('all_goals', [...goals]);
            } catch (error) {
                console.error(`Error fetch goals:`, error);

                if (error instanceof Error && error.message.includes('No goals found for the specified user')) {
                    io.of('/goals').to(`user_${userId}`).emit('all_goals', []);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch all goals',
                        type: 'goal_error',
                    })
                }
            }
        });

        socket.on('request_categorized_goals', async () => {
            try {
                const goalsByCategory = await goalsService.goalsByCategory(accessToken);
                io.of('/goals').to(`user_${userId}`).emit('categorized_goals', goalsByCategory);
            } catch (error) {
                console.error(`Error fetch categorized goals:`, error);

                if (error instanceof Error && error.message.includes('No categorized goals found for the specified user')) {
                    io.of('/goals').to(`user_${userId}`).emit('categorized_goals', {
                        shortTermGoalsTargetAmount: 0,
                        mediumTermGoalsTargetAmount: 0,
                        longTermGoalsTargetAmount: 0,
                        shortTermGoalsCurrntAmount: 0,
                        mediumTermGoalsCurrntAmount: 0,
                        longTermGoalsCurrntAmount: 0
                    });
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch categorized_goals goals',
                        type: 'categorized_goal_error',
                    })
                }
            }
        });

        socket.on('request_longest_timeperiod', async () => {
            try {
                const longestTimePeriod = await goalsService.findLongestTimePeriod(accessToken);
                io.of('/goals').to(`user_${userId}`).emit('longest_timeperiod', longestTimePeriod);
            } catch (error) {
                console.error(`Error fetch longest Timeperiod:`, error);

                if (error instanceof Error && error.message.includes('No goals found. Please ensure goals exist in the system.')) {
                    io.of('/goals').to(`user_${userId}`).emit('longest_timeperiod', '');
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch longest_timeperiod',
                        type: 'longest_timeperiod_error',
                    })
                }
            }
        });

        socket.on('request_total_active_goal_amount', async () => {
            try {
                const totalActiveGoalAmount = await goalsService.getTotalActiveGoalAmount(accessToken);
                io.of('/goals').to(`user_${userId}`).emit('total_active_goal_amount', totalActiveGoalAmount);
            } catch (error) {
                console.error(`Error fetch total active goal amount:`, error);

                if (error instanceof Error && error.message.includes('No goals found. Please ensure goals exist in the system.')) {
                    io.of('/goals').to(`user_${userId}`).emit('total_active_goal_amount', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total active goal amount',
                        type: 'total_active_goal_amount_error',
                    })
                }
            }
        });

        socket.on('request_total_initial_goal_amount', async () => {
            try {
                const totalInitialGoalAmount = await goalsService.getTotalInitialGoalAmount(accessToken);
                io.of('/goals').to(`user_${userId}`).emit('total_initial_goal_amount', totalInitialGoalAmount);
            } catch (error) {
                console.error(`Error fetch total initial goal amount:`, error);

                if (error instanceof Error && error.message.includes('No goals found. Please ensure goals exist in the system.')) {
                    io.of('/goals').to(`user_${userId}`).emit('total_initial_goal_amount', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total initial goal amount',
                        type: 'total_initial_goal_amount_error',
                    })
                }
            }
        });

        socket.on('request_smart_analysis', async () => {
            try {
                const smartAnalysisResult = await goalsService.analyzeGoal(accessToken);
                io.of('/goals').to(`user_${userId}`).emit('smart_analysis', smartAnalysisResult);
            } catch (error) {
                console.error(`Error fetch smart Analysis:`, error);

                if (error instanceof Error && error.message.includes('No goals found. Please ensure goals exist in the system.')) {
                    io.of('/goals').to(`user_${userId}`).emit('smart_analysis', {
                    isSmartCompliant: false,
                    feedback: {
                        Overall: `No active goals found to analyze.`,
                    },
                    suggestions: [],
                    totalScore: 0,
                    criteriaScores: {
                        specific: 0,
                        measurable: 0,
                        achievable: 0,
                        relevant: 0,
                        timeBound: 0,
                    },
                });
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total initial goal amount',
                        type: 'total_initial_goal_amount_error',
                    })
                }
            }
        });

        socket.on('request_daily_contribution', async () => {
            try {
                const totalDailyContribution = await goalsService.dailyContribution(accessToken);
                io.of('/goals').to(`user_${userId}`).emit('daily_contribution', totalDailyContribution);
            } catch (error) {
                console.error(`Error fetch total daily goal contribution:`, error);

                if (error instanceof Error && error.message.includes('No goals found. Please ensure goals exist in the system.')) {
                    io.of('/goals').to(`user_${userId}`).emit('daily_contribution', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total daily goal contribution',
                        type: 'total_daily_contribution_error',
                    })
                }
            }
        });

        socket.on('request_monthly_contribution', async () => {
            try {
                const totalMonthlyContribution = await goalsService.monthlyContribution(accessToken);
                io.of('/goals').to(`user_${userId}`).emit('monthly_contribution', totalMonthlyContribution);
            } catch (error) {
                console.error(`Error fetch total monthly goal contribution:`, error);

                if (error instanceof Error && error.message.includes('No goals found. Please ensure goals exist in the system.')) {
                    io.of('/goals').to(`user_${userId}`).emit('monthly_contribution', 0);
                } else {
                    socket.emit('error', {
                        message: 'Failed to fetch total monthly goal contribution',
                        type: 'total_monthly_goal_contributation_error',
                    })
                }
            }
        });

        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Goal Socket ${socket.id} disconnected`);
        });

    } catch (error) {
        console.error('Error in registerGoalsHandlers:', error);
        socket.emit('error', {
            message: 'Failed to initialize goals handlers',
            type: 'initialization_error'
        });      
    }
};

export default registerGoalsHandlers;