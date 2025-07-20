"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TransactionService_1 = __importDefault(require("services/transaction/TransactionService"));
const transactionService = TransactionService_1.default.instance;
const registerTransactionsHandlers = function (io, socket) {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;
    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Transaction Socket ${socket.id} joined room: ${roomName}`);
        }
        socket.on('request_all_transactions', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield transactionService.getUserTransactions(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('all_transactions', transactions);
            }
            catch (error) {
                console.error(`Error fetch all transactions:`, error);
                if (error instanceof Error && error.message.includes('No transactions found for the specified user')) {
                    io.of('/transactions').to(`user_${userId}`).emit('all_transactions', []);
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch all transactions',
                        type: 'transaction_error',
                    });
                }
            }
        }));
        socket.on('request_all_expense_transactions', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const allExpenseTransactions = yield transactionService.getAllExpenseTransactionsByCategory(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('all_expense_transactions', allExpenseTransactions);
            }
            catch (error) {
                console.error(`Error fetch all expense transactions:`, error);
                if (error instanceof Error && error.message.includes('Error retrieving expense totals by category')) {
                    io.of('/transactions').to(`user_${userId}`).emit('all_expense_transactions', []);
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch all expense transactions',
                        type: 'transaction_error',
                    });
                }
            }
        }));
        socket.on('request_all_income_transactions', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const allIncomeTransactions = yield transactionService.getAllIncomeTransactionsByCategory(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('all_income_transactions', allIncomeTransactions);
            }
            catch (error) {
                console.error(`Error fetch all income transactions:`, error);
                if (error instanceof Error && error.message.includes('Error retrieving income totals by category')) {
                    io.of('/transactions').to(`user_${userId}`).emit('all_income_transactions', []);
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch all income transactions',
                        type: 'transaction_error',
                    });
                }
            }
        }));
        socket.on('request_monthly_income_trends', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const monthlyIncomeTrends = yield transactionService.getMonthlyIncomeForChart(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('monthly_income_trends', monthlyIncomeTrends);
            }
            catch (error) {
                console.error(`Error fetch all monthly income trends:`, error);
                if (error instanceof Error && error.message.includes('Error retrieving transaction details')) {
                    io.of('/transactions').to(`user_${userId}`).emit('monthly_income_trends', []);
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch all monthly income trends',
                        type: 'transaction_error',
                    });
                }
            }
        }));
        socket.on('request_monthly_expense_trends', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const monthlyExpenseTrends = yield transactionService.getMonthlyExpenseForChart(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('monthly_expense_trends', monthlyExpenseTrends);
            }
            catch (error) {
                console.error(`Error fetch all monthly expense trends:`, error);
                if (error instanceof Error && error.message.includes('Error retrieving monthly expense data')) {
                    io.of('/transactions').to(`user_${userId}`).emit('monthly_expense_trends', []);
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch all monthly expense trends',
                        type: 'transaction_error',
                    });
                }
            }
        }));
        socket.on('request_categorywise_monthly_expense', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryWiseMonthlyExpense = yield transactionService.getCategoryWiseExpense(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('categorywise_monthly_expense', categoryWiseMonthlyExpense);
            }
            catch (error) {
                console.error(`Error fetch categorywise monthly expense:`, error);
                if (error instanceof Error && error.message.includes('Failed to retrieve monthly expense total')) {
                    io.of('/transactions').to(`user_${userId}`).emit('categorywise_monthly_expense', []);
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch categorywise monthly expense',
                        type: 'transaction_error',
                    });
                }
            }
        }));
        socket.on('request_current_month_total_expense', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentMonthTotalExpense = yield transactionService.getMonthlyTotalExpense(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('current_month_total_expense', currentMonthTotalExpense);
            }
            catch (error) {
                console.error(`Error fetch current month total expense:`, error);
                if (error instanceof Error && error.message.includes('Failed to retrieve monthly expense total')) {
                    io.of('/transactions').to(`user_${userId}`).emit('current_month_total_expense', {
                        currentMonthExpenseTotal: 0,
                        previousMonthExpenseTotal: 0,
                    });
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch current month total expense',
                        type: 'transaction_error',
                    });
                }
            }
        }));
        socket.on('request_current_month_total_income', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentMonthTotalIncome = yield transactionService.getMonthlyTotalIncome(accessToken);
                io.of('/transactions').to(`user_${userId}`).emit('current_month_total_income', currentMonthTotalIncome);
            }
            catch (error) {
                console.error(`Error fetch current month total income:`, error);
                if (error instanceof Error && error.message.includes('Error retrieving transaction details')) {
                    io.of('/transactions').to(`user_${userId}`).emit('current_month_total_income', {
                        currentMonthTotal: 0,
                        previousMonthTotal: 0,
                    });
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch current month total income',
                        type: 'transaction_error',
                    });
                }
            }
        }));
        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Transaction Socket ${socket.id} disconnected`);
        });
    }
    catch (error) {
        console.error('Error in registerTransactionsHandlers:', error);
        socket.emit('error', {
            message: 'Failed to initialize Transaction handlers',
            type: 'connect_error'
        });
    }
};
exports.default = registerTransactionsHandlers;
