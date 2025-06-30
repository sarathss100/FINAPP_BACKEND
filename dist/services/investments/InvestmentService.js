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
/**
 * Service class for managing accounts, including creating, updating, deleting, and retrieving accounts.
 * This class interacts with the account repository to perform database operations.
 */
class InvestmentService {
    /**
     * Constructs a new instance of the AccountsService.
     *
     * @param {IAccountsManagementRepository} accountRepository - The repository used for interacting with account data.
     */
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
    /**
     * Searches for stocks based on a keyword using the Alpha Vantage API.
     *
     * @param {string} keyword - The keyword or symbol to search for stocks.
     * @returns {Promise<IStock[]>} - A promise resolving to an array of matching stock data.
     * @throws {Error} - Throws an error if the API request fails or returns a non-200 status code.
     */
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
    /**
     * Creates a new investment for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user.
     * @param {InvestmentDTO} investmentData - The validated data required to create an investment.
     * @returns {Promise<InvestmentDTO>} A promise that resolves with the created investment object.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during the investment creation process.
     */
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
     *
     * @returns {Promise<void>}
     * @throws {Error} If there's a failure in fetching or updating investment data.
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
}
exports.default = InvestmentService;
