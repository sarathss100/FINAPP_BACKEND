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
    /**
     * Private constructor to enforce singleton pattern.
     */
    constructor() { }
    /**
     * Gets the singleton instance of InvestmentManagementRepository
     *
     * @returns {IInvestmentManagementRepository}
     */
    static get instance() {
        if (!InvestmentManagementRepository._instance) {
            InvestmentManagementRepository._instance = new InvestmentManagementRepository();
        }
        return InvestmentManagementRepository._instance;
    }
    /**
     * Creates a new investment in the database.
     *
     * @param {InvestmentDTO} investmentData - The validated investment data from the frontend.
     * @param {string} userId - The ID of the user creating the investment.
     * @returns {Promise<IInvestmentDocument>} - A promise resolving to the created investment document.
     * @throws {Error} - Throws an error if the database operation fails.
     */
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
    /**
     * Fetches all investments of a specific type from the database.
     *
     * @param {string} investmentType - The type of investment to retrieve (e.g., STOCK, MUTUAL_FUND).
     * @returns {Promise<InvestmentDTO[]>} - A promise resolving to an array of investment DTOs.
     * @throws {Error} - Throws an error if the investment type is invalid or the database operation fails.
     */
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
                throw new Error(`Failed to fetch investments: ${error.message}`);
            }
        });
    }
    /**
     * Updates multiple investment documents in bulk for the same investment type.
     *
     * @param {InvestmentDTO[]} investments - An array of investment DTOs to be updated.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the investment type is invalid or the database operation fails.
     */
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
}
exports.default = InvestmentManagementRepository;
