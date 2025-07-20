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
const AccountService_1 = __importDefault(require("services/accounts/AccountService"));
const accountsService = AccountService_1.default.instance;
const registerAccountsHandlers = function (io, socket) {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;
    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Account Socket ${socket.id} joined room: ${roomName}`);
        }
        socket.on('request_balance_update', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const totalBalance = yield accountsService.getTotalBalance(accessToken);
                const totalBankBalance = yield accountsService.getTotalBankBalance(accessToken);
                const totalDebt = yield accountsService.getTotalDebt(accessToken);
                const totalInvestment = yield accountsService.getTotalInvestment(accessToken);
                io.of('/accounts').to(`user_${userId}`).emit('balance_update', {
                    totalBalance,
                    totalBankBalance,
                    totalDebt,
                    totalInvestment
                });
            }
            catch (error) {
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
                }
                else {
                    // Send error to client instead of crashing server
                    socket.emit('error', {
                        message: 'Failed to fetch balance update',
                        type: 'balance_error'
                    });
                }
            }
        }));
        socket.on('request_accounts_update', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const accounts = yield accountsService.getUserAccounts(accessToken);
                // Send the accounts data in the format expected by client
                // The client expects a Record<string, IAccount> format
                io.of('/accounts').to(`user_${userId}`).emit('accounts_update', accounts);
            }
            catch (error) {
                console.error('Error fetching accounts update:', error);
                // Check if it's a "no accounts" error and handle gracefully
                if (error instanceof Error && error.message.includes('No accounts found')) {
                    // Send empty accounts data for fresh users
                    // Send as empty object (not array) to match expected format
                    io.of('/accounts').to(`user_${userId}`).emit('accounts_update', {});
                }
                else {
                    // Send error to client instead of crashing server
                    socket.emit('error', {
                        message: 'Failed to fetch accounts',
                        type: 'accounts_error'
                    });
                }
            }
        }));
        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Account Socket ${socket.id} disconnected`);
        });
    }
    catch (error) {
        console.error('Error in registerAccountsHandlers:', error);
        socket.emit('error', {
            message: 'Failed to initialize account handlers',
            type: 'initialization_error'
        });
    }
};
exports.default = registerAccountsHandlers;
