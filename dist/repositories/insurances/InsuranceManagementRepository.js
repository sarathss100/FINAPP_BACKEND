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
const mongoose_1 = __importDefault(require("mongoose"));
const InsuranceModel_1 = require("model/insurances/model/InsuranceModel");
class InsuranceManagementRepository {
    constructor() { }
    static get instance() {
        if (!InsuranceManagementRepository._instance) {
            InsuranceManagementRepository._instance = new InsuranceManagementRepository();
        }
        return InsuranceManagementRepository._instance;
    }
    // Creates a new insurance record in the database.
    createInsurance(insuranceData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mongooseUserId = new mongoose_1.default.Types.ObjectId(userId);
                const result = yield InsuranceModel_1.InsuranceModel.create(Object.assign(Object.assign({}, insuranceData), { userId: mongooseUserId }));
                const refinedData = {
                    _id: String(result._id),
                    userId: String(result.userId),
                    type: result.type,
                    coverage: result.coverage,
                    premium: result.premium,
                    next_payment_date: result.next_payment_date,
                    payment_status: result.payment_status,
                    status: result.status,
                };
                return refinedData;
            }
            catch (error) {
                console.error('Error creating insurance:', error);
                throw new Error(`Failed to create insurance: ${error.message}`);
            }
        });
    }
    // Removes an existing insurance record from the database by its ID.
    removeInsurance(insuranceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield InsuranceModel_1.InsuranceModel.findByIdAndDelete(insuranceId).exec();
                if (!result) {
                    return null;
                }
                const refinedData = {
                    _id: String(result._id),
                    userId: String(result.userId),
                    type: result.type,
                    coverage: result.coverage,
                    premium: result.premium,
                    next_payment_date: result.next_payment_date,
                    payment_status: result.payment_status,
                    status: result.status,
                };
                return refinedData;
            }
            catch (error) {
                console.error('Error deleting insurance:', error);
                throw new Error(`Failed to delete insurance: ${error.message}`);
            }
        });
    }
    // Calculates the total coverage amount from all active insurance policies for a given user.
    getUserInsuranceCoverageTotal(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield InsuranceModel_1.InsuranceModel.aggregate([
                    // Match only active insurance policies for the given userId
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId),
                            status: "active"
                        }
                    },
                    // Sum up the coverage values
                    {
                        $group: {
                            _id: null,
                            totalCoverage: { $sum: "$coverage" }
                        }
                    }
                ]);
                // Return the total coverage or 0 if no active policies found
                return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalCoverage) || 0;
            }
            catch (error) {
                console.error('Error calculating total insurance coverage:', error);
                throw new Error(`Failed to calculate insurance coverage`);
            }
        });
    }
    // Calculates the total premium amount from all active insurance policies for a given user.
    getUserTotalPremiumAmount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield InsuranceModel_1.InsuranceModel.aggregate([
                    // Match only active insurance policies for the given userId
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId),
                            status: "active"
                        }
                    },
                    // Sum up the premium values
                    {
                        $group: {
                            _id: null,
                            totalPremium: { $sum: "$premium" }
                        }
                    }
                ]);
                // Return the total premium or 0 if no active policies found
                return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalPremium) || 0;
            }
            catch (error) {
                console.error('Error calculating total insurance annual premium:', error);
                throw new Error(`Failed to calculate insurance annual premium`);
            }
        });
    }
    // Retrieves all insurance records for a given user from the database.
    getAllInsurances(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield InsuranceModel_1.InsuranceModel.find({ userId });
                const refinedData = result.map((data) => ({
                    _id: String(data._id),
                    userId: String(data.userId),
                    type: data.type,
                    coverage: data.coverage,
                    premium: data.premium,
                    next_payment_date: data.next_payment_date,
                    payment_status: data.payment_status,
                    status: data.status,
                }));
                return refinedData;
            }
            catch (error) {
                console.error('Error fetching insurances:', error);
                throw new Error(`Failed to fetch insurance records`);
            }
        });
    }
    // Retrieves the insurance policy with the closest upcoming next payment date from all active policies for a given user.
    getClosestNextPaymentDate(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const results = yield InsuranceModel_1.InsuranceModel.aggregate([
                    // Match only active policies with upcoming payments
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId),
                            status: 'active',
                            payment_status: 'paid',
                            next_payment_date: { $gte: new Date() }
                        }
                    },
                    // Sort by closest next payment date
                    {
                        $sort: {
                            next_payment_date: 1
                        }
                    },
                    // Limit to the closest one
                    {
                        $limit: 1
                    }
                ]);
                // If no matching policy found, return null
                if (!results || results.length === 0) {
                    return null;
                }
                const insurance = results[0];
                // Map to InsuranceDTO
                const insuranceDTO = {
                    _id: insurance._id.toString(),
                    userId: ((_a = insurance.userId) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                    type: insurance.type,
                    coverage: insurance.coverage,
                    premium: insurance.premium,
                    next_payment_date: insurance.next_payment_date,
                    payment_status: insurance.payment_status,
                    status: insurance.status
                };
                return insuranceDTO;
            }
            catch (error) {
                console.error('Error fetching closest next payment insurance:', error);
                throw new Error(`Failed to fetch closest next payment insurance`);
            }
        });
    }
    // Updates the payment status of an insurance policy to "paid" and revises the next payment date to 365 days ahead.
    markPaymentAsPaid(insuranceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch the current document to get the current next_payment_date
                const insurance = yield InsuranceModel_1.InsuranceModel.findById(insuranceId);
                if (!insurance) {
                    throw new Error('Insurance policy not found');
                }
                // Calculate next payment date: add 365 days to the current next_payment_date
                const currentNextPaymentDate = insurance.next_payment_date;
                const newNextPaymentDate = new Date(currentNextPaymentDate);
                newNextPaymentDate.setDate(newNextPaymentDate.getDate() + 365);
                // Update both the payment status and the next payment date
                const updatedInsurance = yield InsuranceModel_1.InsuranceModel.findByIdAndUpdate(insuranceId, {
                    $set: {
                        payment_status: "paid",
                        status: "active",
                        next_payment_date: newNextPaymentDate
                    }
                }, { new: true });
                if (!updatedInsurance) {
                    throw new Error('Failed to update insurance policy');
                }
                // Convert Mongoose document to InsuranceDTO
                const refinedData = {
                    _id: String(updatedInsurance._id),
                    userId: String(updatedInsurance.userId),
                    type: updatedInsurance.type,
                    coverage: updatedInsurance.coverage,
                    premium: updatedInsurance.premium,
                    next_payment_date: updatedInsurance.next_payment_date,
                    payment_status: updatedInsurance.payment_status,
                    status: updatedInsurance.status,
                };
                return refinedData;
            }
            catch (error) {
                console.error('Error updating insurance payment status:', error);
                throw new Error(`Failed to update payment status: ${error.message}`);
            }
        });
    }
    /**
     * Marks insurance policies as expired if their next payment date has passed and they are still marked as paid.
     * Updates the payment status to "unpaid" and the policy status to "expired".
     */
    markExpiredInsurances() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                yield InsuranceModel_1.InsuranceModel.updateMany({
                    next_payment_date: { $lt: today },
                    payment_status: 'paid',
                    status: { $ne: 'expired' }
                }, {
                    $set: {
                        payment_status: 'unpaid',
                        status: 'expired'
                    }
                });
            }
            catch (error) {
                console.error('Error updating insurance payment status:', error);
                throw new Error(`Failed to update payment status: ${error.message}`);
            }
        });
    }
    // Retrieves insurance policies whose next payment date is within the next 2 days.
    getInsuranceForNotifyInsurancePayments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const twoDaysFromNow = new Date();
                twoDaysFromNow.setDate(now.getDate() + 2);
                // Fetch only those policies whose next payment date is within the next 2 days
                const insurances = yield InsuranceModel_1.InsuranceModel.find({
                    next_payment_date: {
                        $gte: now,
                        $lte: twoDaysFromNow
                    }
                });
                const refinedData = insurances.map((data) => ({
                    _id: String(data._id),
                    userId: String(data.userId),
                    type: data.type,
                    coverage: data.coverage,
                    premium: data.premium,
                    next_payment_date: data.next_payment_date,
                    payment_status: data.payment_status,
                    status: data.status,
                }));
                return refinedData;
            }
            catch (error) {
                console.error('Error fetching insurance records:', error);
                throw new Error(`Failed to retrieve insurance data: ${error.message}`);
            }
        });
    }
}
exports.default = InsuranceManagementRepository;
