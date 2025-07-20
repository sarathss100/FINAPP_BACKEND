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
const InvestmentManagementRepository_1 = __importDefault(require("repositories/investments/InvestmentManagementRepository"));
const axios_1 = __importDefault(require("axios"));
const tokenUtils_1 = require("utils/auth/tokenUtils");
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const regionRegex_1 = require("utils/investments/stockcurrencyconverter/regionRegex");
const currencyConverter_1 = require("utils/investments/stockcurrencyconverter/currencyConverter");
const getMutualFundDetails_1 = __importDefault(require("utils/mutualfunds/getMutualFundDetails"));
const calculateBondProfitOrLoss_1 = __importDefault(require("utils/investments/stockcurrencyconverter/calculateBondProfitOrLoss"));
const updateStockPricesJob_1 = require("utils/investments/stockcurrencyconverter/updateStockPricesJob");
const updateMutualFundPrices_1 = require("utils/investments/stockcurrencyconverter/updateMutualFundPrices");
const updateGoldPrices_1 = require("utils/investments/stockcurrencyconverter/updateGoldPrices");
const updateBondPrices_1 = require("utils/investments/stockcurrencyconverter/updateBondPrices");
const eventBus_1 = require("events/eventBus");
class InvestmentService {
    constructor(investmentRepository) {
        this._investmentRepository = investmentRepository;
    }
    static get instance() {
        if (!InvestmentService._instance) {
            const repo = InvestmentManagementRepository_1.default.instance;
            InvestmentService._instance = new InvestmentService(repo);
        }
        return InvestmentService._instance;
    }
    // Searches for stocks based on a keyword using the Alpha Vantage API.
    searchStocks(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
                const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`;
                const response = yield axios_1.default.get(url);
                if (response.status !== 200) {
                    return [];
                }
                return response.data.bestMatches || [];
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error fetching Stocks:', error);
                throw new Error(error.message);
            }
        });
    }
    // Creates a new investment for the authenticated user.
    createInvestment(accessToken, investmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                if (investmentData.type === 'STOCK') {
                    if (investmentData.symbol) {
                        const apikey = process.env.ALPHA_VANTAGE_API_KEY;
                        const stockDetails = yield axios_1.default.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${investmentData.symbol}&apikey=${apikey}`);
                        const amount = Number(stockDetails.data['Global Quote']['05. price']) || 1;
                        const currencyDetected = (0, regionRegex_1.detectCurrencyFromExchange)(investmentData.symbol.split('.')[1] || 'NASDAQ');
                        const amountForOneShare = yield (0, currencyConverter_1.getExchangeRate)(currencyDetected, 'INR', amount);
                        investmentData.currentPricePerShare = amountForOneShare || 0;
                        investmentData.currentValue = (amountForOneShare * investmentData.quantity) || 0;
                        investmentData.totalProfitOrLoss = ((amountForOneShare * investmentData.quantity) - (investmentData.purchasePricePerShare * investmentData.quantity)) || 0;
                    }
                }
                else if (investmentData.type === 'GOLD') {
                    const goldDetails = yield axios_1.default.get(`https://api.gold-api.com/price/XAU`);
                    const currentPricePerShare = goldDetails.data['price'] || 0;
                    investmentData.currentPricePerGram = currentPricePerShare;
                    investmentData.currentValue = currentPricePerShare * investmentData.weight || 0;
                    investmentData.totalProfitOrLoss = ((currentPricePerShare * investmentData.weight) - (investmentData.purchasePricePerGram * investmentData.weight)) || 0;
                }
                else if (investmentData.type === 'MUTUAL_FUND') {
                    const schemeCode = investmentData.schemeCode;
                    const mutualFundDetails = yield (0, getMutualFundDetails_1.default)(schemeCode);
                    investmentData.initialAmount = investmentData.units * investmentData.purchasedNav;
                    investmentData.currentValue = investmentData.units * mutualFundDetails.net_asset_value;
                    investmentData.totalProfitOrLoss = ((investmentData.units * mutualFundDetails.net_asset_value) - (investmentData.units * (investmentData.currentNav || 1)));
                }
                else if (investmentData.type === 'BOND') {
                    const { currentValue, totalProfitOrLoss } = (0, calculateBondProfitOrLoss_1.default)(investmentData);
                    investmentData.currentValue = currentValue;
                    investmentData.totalProfitOrLoss = totalProfitOrLoss;
                }
                else if (investmentData.type === 'PROPERTY') {
                    investmentData.totalProfitOrLoss = investmentData.currentValue ? (investmentData.currentValue - investmentData.initialAmount) : investmentData.initialAmount;
                }
                else if (investmentData.type === 'BUSINESS') {
                    investmentData.currentValue = investmentData.currentValuation;
                    investmentData.totalProfitOrLoss = investmentData.currentValuation ? (investmentData.currentValuation - investmentData.initialAmount) : investmentData.initialAmount;
                }
                else if (investmentData.type === 'FIXED_DEPOSIT') {
                    investmentData.currentValue = investmentData.initialAmount;
                    investmentData.totalProfitOrLoss = investmentData.maturityAmount ? (investmentData.maturityAmount - investmentData.initialAmount) : investmentData.initialAmount;
                }
                else if (investmentData.type === 'EPFO') {
                    investmentData.currentValue = investmentData.initialAmount;
                    investmentData.totalProfitOrLoss = 0;
                }
                // Delegate to the repository to create the investment for the user
                const investment = yield this._investmentRepository.createInvestment(investmentData, userId);
                // Emit socket event to notify user about investment Creation
                eventBus_1.eventBus.emit('investment_created', investment);
                return investment;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error creating investment:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Updates current prices for all STOCK-type investments by fetching live data from external APIs
     * and performing a bulk update in the database.
     */
    updateStockPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all stock investments from DB
                const allStockInvestments = yield this._investmentRepository.getInvestments('STOCK');
                // Update stock prices (fetch live data)
                const updatedInvestments = yield (0, updateStockPricesJob_1.updateStockPrices)(allStockInvestments);
                // Bulk update all at once
                if (updatedInvestments.length > 0) {
                    yield this._investmentRepository.updateInvestmentBulk(updatedInvestments);
                    console.log(`Updated ${updatedInvestments.length} stock investments in bulk.`);
                }
                else {
                    console.log(`No stock investments were updated.`);
                }
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Failed to update the stock price:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Updates current NAV values for all MUTUAL_FUND-type investments by fetching live data from external APIs
     * and performing a bulk update in the database.
     */
    updateMutualFundPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all mutual fund investments from DB
                const allMutualFundInvestments = yield this._investmentRepository.getInvestments('MUTUAL_FUND');
                // Update mutual fund prices (fetch live data)
                const updatedInvestments = yield (0, updateMutualFundPrices_1.updateMutualFundPrices)(allMutualFundInvestments);
                // Bulk update all at once
                if (updatedInvestments.length > 0) {
                    yield this._investmentRepository.updateInvestmentBulk(updatedInvestments);
                    console.log(`Updated ${updatedInvestments.length} mutual fund investments in bulk`);
                }
                else {
                    console.log(`No mutual fund investments were updated.`);
                }
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Failed to update the mutual fund prices:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Updates current price per gram and value for all GOLD-type investments by fetching live data
     * and performing a bulk update in the database.
     */
    updateGoldPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all gold investments from DB
                const allGoldInvestments = yield this._investmentRepository.getInvestments('GOLD');
                // Update gold prices (fetch live data)
                const updatedInvestments = yield (0, updateGoldPrices_1.updateGoldPrices)(allGoldInvestments);
                // Bulk update all at once
                if (updatedInvestments.length > 0) {
                    yield this._investmentRepository.updateInvestmentBulk(updatedInvestments);
                    console.log(`Updated ${updatedInvestments.length} gold investments in bulk`);
                }
                else {
                    console.log(`No gold investments were updated.`);
                }
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Failed to update the gold prices:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Recalculates current value and profit/loss for all BOND-type investments
     * and performs a bulk update in the database.
     */
    updateBondPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all bond investments from DB
                const allBondInvestments = yield this._investmentRepository.getInvestments('BOND');
                // Recalculate bond values
                const updatedInvestments = yield (0, updateBondPrices_1.updateBondPrices)(allBondInvestments);
                // Bulk update all at once
                if (updatedInvestments.length > 0) {
                    yield this._investmentRepository.updateInvestmentBulk(updatedInvestments);
                    console.log(`Updated ${updatedInvestments.length} bond investments in bulk`);
                }
                else {
                    console.log(`No bond investments were updated.`);
                }
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Failed to update the bond values:', error);
                throw new Error(error.message);
            }
        });
    }
    // Fetches the total initial investment amount for the authenticated user across all investment types
    totalInvestment(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                const totalInvestedAmount = yield this._investmentRepository.totalInvestment(userId);
                return totalInvestedAmount;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Failed to fetch total investment:', error);
                throw new Error(error.message);
            }
        });
    }
    // Fetches the current total value of all investments for the authenticated user.
    currentTotalValue(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                const currentTotalValue = yield this._investmentRepository.currentTotalValue(userId);
                return currentTotalValue;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Failed to fetch current total value:', error);
                throw new Error(error.message);
            }
        });
    }
    // Fetches the total returns (profit or loss) from all investments for the authenticated user
    getTotalReturns(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                const totalReturns = yield this._investmentRepository.getTotalReturns(userId);
                return totalReturns;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Failed to fetch total returns (profit or loss):', error);
                throw new Error(error.message);
            }
        });
    }
    // Fetches all investments for the authenticated user and categorizes them by investment type
    getCategorizedInvestments(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                const investments = yield this._investmentRepository.getCategorizedInvestments(userId);
                // Group investments by type/category
                const categorized = {};
                for (const inv of Object.values(investments).flat()) {
                    const key = inv.type || 'UNKNOWN';
                    if (!categorized[key]) {
                        categorized[key] = [];
                    }
                    categorized[key].push(inv);
                }
                return categorized;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Failed to fetch and categorize investments:', error);
                throw new Error(error.message);
            }
        });
    }
    // Removes an investment document of the specified type and ID from the database.
    removeInvestment(investmentType, investmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const investment = yield this._investmentRepository.removeInvestment(investmentType, investmentId);
                // Emit socket event to notify user about investment Deletion
                eventBus_1.eventBus.emit('investment_removed', investment);
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Failed to delete investment:', error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = InvestmentService;
