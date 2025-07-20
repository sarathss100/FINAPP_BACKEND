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
const InvestmentModel_1 = require("model/investments/model/InvestmentModel");
const mongoose_1 = __importDefault(require("mongoose"));
const modelMap = {
    STOCK: InvestmentModel_1.StockModel,
    MUTUAL_FUND: InvestmentModel_1.MutualFundModel,
    BOND: InvestmentModel_1.BondModel,
    PROPERTY: InvestmentModel_1.PropertyModel,
    BUSINESS: InvestmentModel_1.BusinessModel,
    FIXED_DEPOSIT: InvestmentModel_1.FixedDepositModel,
    EPFO: InvestmentModel_1.EPFOModel,
    GOLD: InvestmentModel_1.GoldModel,
    PARKING_FUND: InvestmentModel_1.ParkingFundModel,
};
class InvestmentManagementRepository {
    constructor() { }
    static get instance() {
        if (!InvestmentManagementRepository._instance) {
            InvestmentManagementRepository._instance = new InvestmentManagementRepository();
        }
        return InvestmentManagementRepository._instance;
    }
    // Creates a new investment in the database.
    createInvestment(investmentData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mongooseUserId = new mongoose_1.default.Types.ObjectId(userId);
                const relatedAccount = new mongoose_1.default.Types.ObjectId(investmentData.relatedAccount);
                const Model = modelMap[investmentData.type];
                if (!Model)
                    throw new Error('Invalid investment type');
                const investmentDoc = yield Model.create(Object.assign(Object.assign({}, investmentData), { userId: mongooseUserId, relatedAccount }));
                const plainInvestment = investmentDoc.toObject();
                return plainInvestment;
            }
            catch (error) {
                console.error('Error creating investment:', error);
                throw new Error(`Failed to create investment: ${error.message}`);
            }
        });
    }
    // Fetches all investments of a specific type from the database.
    getInvestments(investmentType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Model = modelMap[investmentType];
                if (!Model) {
                    throw new Error(`Invalid investment type: ${investmentType}`);
                }
                // Fetch all documents for this investment type
                const investmentDocs = yield Model.find();
                // Convert Mongoose documents to plain objects and return as InvestmentDTO[]
                const plainInvestments = investmentDocs.map(doc => doc.toObject());
                return plainInvestments;
            }
            catch (error) {
                console.error('Error fetching investments:', error);
                throw new Error(`Failed to fetch investments`);
            }
        });
    }
    // Updates multiple investment documents in bulk for the same investment type.
    updateInvestmentBulk(investments) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!investments.length)
                    return;
                const investmentType = investments[0].type;
                const Model = modelMap[investmentType];
                if (!Model)
                    throw new Error(`Invalid investment type: ${investmentType}`);
                // Prepare bulk operations
                const operations = investments.map((investment) => ({
                    updateOne: {
                        filter: { _id: investment._id },
                        update: { $set: investment },
                    },
                }));
                // Perform the bulk write 
                yield Model.bulkWrite(operations, { ordered: false }); // ordered: false continues on error
            }
            catch (error) {
                console.error('Error fetching investments:', error);
                throw new Error(`Failed to fetch investments: ${error.message}`);
            }
        });
    }
    // Calculates the total initial investment amount across all investment types for a given user.
    totalInvestment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let total = 0;
                for (const Model of Object.values(modelMap)) {
                    const result = yield Model.aggregate([
                        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
                        {
                            $group: {
                                _id: null,
                                totalInitialAmount: { $sum: '$initialAmount' }
                            }
                        }
                    ]);
                    total += ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalInitialAmount) || 0;
                }
                return total;
            }
            catch (error) {
                console.error('Error calculating total investment:', error);
                throw new Error(`Failed to calculate total investment`);
            }
        });
    }
    // Calculates the current total value across all investment types for a given user.
    currentTotalValue(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let total = 0;
                for (const Model of Object.values(modelMap)) {
                    const result = yield Model.aggregate([
                        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
                        {
                            $group: {
                                _id: null,
                                currentTotalValue: { $sum: '$currentValue' }
                            }
                        }
                    ]);
                    total += ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.currentTotalValue) || 0;
                }
                return total;
            }
            catch (error) {
                console.error('Error calculating current total value:', error);
                throw new Error(`Failed to calculate current total value`);
            }
        });
    }
    // Calculates the total returns (profit or loss) across all investment types for a given user.
    getTotalReturns(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let total = 0;
                // Iterate through each investment model (e.g., stocks, crypto, mutual funds)
                for (const Model of Object.values(modelMap)) {
                    // Aggregate total profit or loss for the current investment type and user
                    const result = yield Model.aggregate([
                        {
                            $match: {
                                userId: new mongoose_1.default.Types.ObjectId(userId)
                            }
                        },
                        {
                            $group: {
                                _id: null, // Group all documents into one
                                currentTotalValue: { $sum: '$totalProfitOrLoss' } // Sum all profit/loss values
                            }
                        }
                    ]);
                    // Add the result for this investment type to the total, defaulting to 0 if no data
                    total += ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.currentTotalValue) || 0;
                }
                return total;
            }
            catch (error) {
                // Log detailed error and re-throw with context
                console.error('Error calculating total returns (profit or loss):', error);
                throw new Error(`Failed to calculate total returns`);
            }
        });
    }
    // Fetches all investments for a given user and categorizes them by investment type.
    getCategorizedInvestments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const categorizedInvestments = {};
                const mongooseUserId = new mongoose_1.default.Types.ObjectId(userId);
                // Loop through each investment model (e.g., StockModel, MutualFundModel)
                for (const Model of Object.values(modelMap)) {
                    // Fetch all investments of this type belonging to the user
                    const result = yield Model.aggregate([
                        {
                            $match: {
                                userId: mongooseUserId
                            }
                        }
                    ]);
                    if (!Array.isArray(result) || result.length === 0) {
                        continue; // skip if no investments found
                    }
                    // Convert Mongoose documents to plain objects
                    const investments = result.map(doc => doc);
                    // Determine category from model or individual document
                    const category = (_a = investments[0]) === null || _a === void 0 ? void 0 : _a.type;
                    if (!category) {
                        console.warn('Uncategorized or invalid investment type found');
                        continue;
                    }
                    // Initialize category if not exists
                    if (!categorizedInvestments[category]) {
                        categorizedInvestments[category] = [];
                    }
                    // Add all investments to the appropriate category
                    categorizedInvestments[category].push(...investments);
                }
                return categorizedInvestments;
            }
            catch (error) {
                console.error('Error fetching and categorizing investments:', error);
                throw new Error(`Failed to fetch and categorize investments`);
            }
        });
    }
    // Deletes a single investment document by ID for a given investment type.
    removeInvestment(investmentType, investmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Model = modelMap[investmentType];
                if (!Model) {
                    throw new Error(`Invalid investment type: ${investmentType}`);
                }
                // Convert investmentId to ObjectId
                const mongooseId = new mongoose_1.default.Types.ObjectId(investmentId);
                // Find the document before deletion
                const investment = yield Model.findById(mongooseId);
                if (!investment) {
                    throw new Error(`No investment found with ID: ${investmentId}`);
                }
                // Delete the document
                const result = yield Model.deleteOne({ _id: mongooseId });
                if (result.deletedCount === 0) {
                    throw new Error(`Failed to delete investment with ID: ${investmentId}`);
                }
                const plainInvestment = investment.toObject();
                return plainInvestment;
            }
            catch (error) {
                console.error('Error deleting investment:', error);
                throw new Error(`Failed to delete investment: ${error.message}`);
            }
        });
    }
}
exports.default = InvestmentManagementRepository;
