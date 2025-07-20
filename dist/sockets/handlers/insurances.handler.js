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
const InsuranceService_1 = __importDefault(require("services/insurances/InsuranceService"));
const insuranceService = InsuranceService_1.default.instance;
const registerInsurancesHandlers = function (io, socket) {
    const accessToken = socket.data.accessToken;
    const userId = socket.data.userId;
    try {
        if (!socket.rooms.has(`user_${userId}`)) {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`Insurance Socket ${socket.id} joined room: ${roomName}`);
        }
        socket.on('request_all_insurances', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const insurances = yield insuranceService.getAllInsurances(accessToken);
                io.of('/insurances').to(`user_${userId}`).emit('all_insurances', [...insurances]);
            }
            catch (error) {
                console.error(`Error fetch all insurances:`, error);
                if (error instanceof Error && error.message.includes('Failed to fetch insurance records')) {
                    io.of('/insurances').to(`user_${userId}`).emit('all_insurances', []);
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch all insurances',
                        type: 'insurance_error',
                    });
                }
            }
        }));
        socket.on('request_total_insurance_coverage', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const totalInsuranceCoverage = yield insuranceService.getUserInsuranceCoverageTotal(accessToken);
                io.of('/insurances').to(`user_${userId}`).emit('total_insurance_coverage', totalInsuranceCoverage);
            }
            catch (error) {
                console.error(`Error fetch total insurance coverage:`, error);
                if (error instanceof Error && error.message.includes('Failed to calculate total insurance coverage')) {
                    io.of('/insurances').to(`user_${userId}`).emit('total_insurance_coverage', 0);
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch total insurance coverage',
                        type: 'insurance_error',
                    });
                }
            }
        }));
        socket.on('request_total_annual_insurance_premium', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const totalAnnualInsurancePremium = yield insuranceService.getUserTotalPremiumAmount(accessToken);
                io.of('/insurances').to(`user_${userId}`).emit('total_annual_insurance_premium', totalAnnualInsurancePremium);
            }
            catch (error) {
                console.error(`Error fetch total annual insurance premium:`, error);
                if (error instanceof Error && error.message.includes('Failed to calculate insurance annual premium')) {
                    io.of('/insurances').to(`user_${userId}`).emit('total_annual_insurance_premium', 0);
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch total_annual_insurance_premium',
                        type: 'insurance_error',
                    });
                }
            }
        }));
        socket.on('request_next_payment_date', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const nextPaymentDate = yield insuranceService.getClosestNextPaymentDate(accessToken);
                io.of('/insurances').to(`user_${userId}`).emit('next_payment_date', nextPaymentDate);
            }
            catch (error) {
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
                }
                else {
                    socket.emit('error', {
                        message: 'Failed to fetch next payment date',
                        type: 'insurance_error',
                    });
                }
            }
        }));
        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Insurance Socket ${socket.id} disconnected`);
        });
    }
    catch (error) {
        console.error('Error in registerInsurancesHandlers:', error);
        socket.emit('error', {
            message: 'Failed to initialize Insurance handlers',
            type: 'connect_error'
        });
    }
};
exports.default = registerInsurancesHandlers;
