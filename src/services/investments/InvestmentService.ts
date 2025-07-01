import IInvestmentService from './interfaces/IInvestmentService';
import InvestmentManagementRepository from 'repositories/investments/InvestmentManagementRepository';
import axios from 'axios';
import IStock from './interfaces/IStock';
import { InvestmentDTO } from 'dtos/investments/investmentDTO';
import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { detectCurrencyFromExchange } from 'utils/investments/stockcurrencyconverter/regionRegex';
import { getExchangeRate } from 'utils/investments/stockcurrencyconverter/currencyConverter';
import getMutualFundDetails from 'utils/mutualfunds/getMutualFundDetails';
import calculateBondProfitOrLoss from 'utils/investments/stockcurrencyconverter/calculateBondProfitOrLoss';
import { updateStockPrices } from 'utils/investments/stockcurrencyconverter/updateStockPricesJob';
import { updateMutualFundPrices } from 'utils/investments/stockcurrencyconverter/updateMutualFundPrices';
import { updateGoldPrices } from 'utils/investments/stockcurrencyconverter/updateGoldPrices';
import { updateBondPrices } from 'utils/investments/stockcurrencyconverter/updateBondPrices';

/**
 * Service class for managing accounts, including creating, updating, deleting, and retrieving accounts.
 * This class interacts with the account repository to perform database operations.
 */
class InvestmentService implements IInvestmentService {
    private static _instance: InvestmentService;
    private _investmentRepository: InvestmentManagementRepository;

    /**
     * Constructs a new instance of the AccountsService.
     * 
     * @param {IAccountsManagementRepository} accountRepository - The repository used for interacting with account data.
     */
    constructor(investmentRepository: InvestmentManagementRepository) {
        this._investmentRepository = investmentRepository;
    }

    public static get instance(): InvestmentService {
        if (!InvestmentService._instance) {
            const repo = InvestmentManagementRepository.instance;
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
    async searchStocks(keyword: string): Promise<IStock[]> {
        try {
            const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
            const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`;
            const response = await axios.get(url);
            
            if (response.status !== 200) { 
                return [];
            }
            
            return response.data.bestMatches || [];
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error fetching Stocks:', error);
            throw new Error((error as Error).message);
        }
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
    async createInvestment(accessToken: string, investmentData: InvestmentDTO): Promise<InvestmentDTO> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            if (investmentData.type === 'STOCK') {
                if (investmentData.symbol) {
                    const apikey = process.env.ALPHA_VANTAGE_API_KEY;
                    const stockDetails = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${investmentData.symbol}&apikey=${apikey}`);
                    const amount = Number(stockDetails.data['Global Quote']['05. price']) || 1;
                    const currencyDetected = detectCurrencyFromExchange(investmentData.symbol.split('.')[1] || 'NASDAQ');
                    const amountForOneShare = await getExchangeRate(currencyDetected, 'INR', amount);
                    investmentData.currentPricePerShare = amountForOneShare || 0;
                    investmentData.currentValue = (amountForOneShare * investmentData.quantity) || 0;
                    investmentData.totalProfitOrLoss = ((amountForOneShare * investmentData.quantity) - (investmentData.purchasePricePerShare * investmentData.quantity)) || 0;
                }
            } else if (investmentData.type === 'GOLD') {
                const goldDetails = await axios.get(`https://api.gold-api.com/price/XAU`);
                const currentPricePerShare = goldDetails.data['price'] || 0;
                investmentData.currentPricePerGram = currentPricePerShare;
                investmentData.currentValue = currentPricePerShare * investmentData.weight || 0;
                investmentData.totalProfitOrLoss = ((currentPricePerShare * investmentData.weight) - (investmentData.purchasePricePerGram * investmentData.weight)) || 0;
            } else if (investmentData.type === 'MUTUAL_FUND') {
                const schemeCode = investmentData.schemeCode;
                const mutualFundDetails = await getMutualFundDetails(schemeCode);
                investmentData.initialAmount = investmentData.units * investmentData.purchasedNav;
                investmentData.currentValue = investmentData.units * mutualFundDetails.net_asset_value;
                investmentData.totalProfitOrLoss = ((investmentData.units * mutualFundDetails.net_asset_value) - (investmentData.units * (investmentData.currentNav || 1)));
            } else if (investmentData.type === 'BOND') {
                const { currentValue, totalProfitOrLoss } = calculateBondProfitOrLoss(investmentData);
                investmentData.currentValue = currentValue;
                investmentData.totalProfitOrLoss = totalProfitOrLoss;
            } else if (investmentData.type === 'PROPERTY') {
                investmentData.totalProfitOrLoss = investmentData.currentValue ? (investmentData.currentValue - investmentData.initialAmount) : investmentData.initialAmount;
            } else if (investmentData.type === 'BUSINESS') {
                investmentData.currentValue = investmentData.currentValuation;
                investmentData.totalProfitOrLoss = investmentData.currentValuation ? (investmentData.currentValuation  - investmentData.initialAmount) : investmentData.initialAmount;
            } else if (investmentData.type === 'FIXED_DEPOSIT') {
                investmentData.currentValue = investmentData.initialAmount;
                investmentData.totalProfitOrLoss = investmentData.maturityAmount ?  (investmentData.maturityAmount - investmentData.initialAmount) : investmentData.initialAmount;
            } else if (investmentData.type === 'EPFO') {
                investmentData.currentValue = investmentData.initialAmount;
                investmentData.totalProfitOrLoss = 0
            }

            // Delegate to the repository to create the investment for the user
            const investment = await this._investmentRepository.createInvestment(investmentData, userId);

            return investment;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error creating investment:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Updates current prices for all STOCK-type investments by fetching live data from external APIs 
     * and performing a bulk update in the database.
     *
     * @returns {Promise<void>}
     * @throws {Error} If there's a failure in fetching or updating investment data.
     */
    async updateStockPrice(): Promise<void> {
        try {
            // Get all stock investments from DB
            const allStockInvestments = await this._investmentRepository.getInvestments('STOCK');

            // Update stock prices (fetch live data)
            const updatedInvestments = await updateStockPrices(allStockInvestments);

            // Bulk update all at once
            if (updatedInvestments.length > 0) {
                await this._investmentRepository.updateInvestmentBulk(updatedInvestments);
                console.log(`Updated ${updatedInvestments.length} stock investments in bulk.`);
            } else {
                console.log(`No stock investments were updated.`);
            }

        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Failed to update the stock price:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Updates current NAV values for all MUTUAL_FUND-type investments by fetching live data from external APIs 
     * and performing a bulk update in the database.
     *
     * @returns {Promise<void>}
     * @throws {Error} If there's a failure in fetching or updating mutual fund investment data.
     */
    async updateMutualFundPrice(): Promise<void> {
        try {
            // Get all mutual fund investments from DB
            const allMutualFundInvestments = await this._investmentRepository.getInvestments('MUTUAL_FUND');

            // Update mutual fund prices (fetch live data)
            const updatedInvestments = await updateMutualFundPrices(allMutualFundInvestments);

            // Bulk update all at once
            if (updatedInvestments.length > 0) {
                await this._investmentRepository.updateInvestmentBulk(updatedInvestments);
                console.log(`Updated ${updatedInvestments.length} mutual fund investments in bulk`);
            } else {
                console.log(`No mutual fund investments were updated.`);
            }

        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Failed to update the mutual fund prices:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Updates current price per gram and value for all GOLD-type investments by fetching live data 
     * and performing a bulk update in the database.
     *
     * @returns {Promise<void>}
     * @throws {Error} If there's a failure in fetching or updating investment data.
     */
    async updateGoldPrice(): Promise<void> {
        try {
            // Get all gold investments from DB
            const allGoldInvestments = await this._investmentRepository.getInvestments('GOLD');

            // Update gold prices (fetch live data)
            const updatedInvestments = await updateGoldPrices(allGoldInvestments);

            // Bulk update all at once
            if (updatedInvestments.length > 0) {
                await this._investmentRepository.updateInvestmentBulk(updatedInvestments);
                console.log(`Updated ${updatedInvestments.length} gold investments in bulk`);
            } else {
                console.log(`No gold investments were updated.`);
            }

        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Failed to update the gold prices:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Recalculates current value and profit/loss for all BOND-type investments 
     * and performs a bulk update in the database.
     *
     * @returns {Promise<void>}
     * @throws {Error} If there's a failure during calculation or DB update
     */
    async updateBondPrice(): Promise<void> {
        try {
            // Get all bond investments from DB
            const allBondInvestments = await this._investmentRepository.getInvestments('BOND');

            // Recalculate bond values
            const updatedInvestments = await updateBondPrices(allBondInvestments);

            // Bulk update all at once
            if (updatedInvestments.length > 0) {
                await this._investmentRepository.updateInvestmentBulk(updatedInvestments);
                console.log(`Updated ${updatedInvestments.length} bond investments in bulk`);
            } else {
                console.log(`No bond investments were updated.`);
            }

        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Failed to update the bond values:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Fetches the total initial investment amount for the authenticated user across all investment types.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user.
     * @returns {Promise<number>} A promise resolving to the total initial investment amount.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If there's a failure during database query or summation.
     */
    async totalInvestment(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            const totalInvestedAmount = await this._investmentRepository.totalInvestment(userId);
            return totalInvestedAmount;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Failed to fetch total investment:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Fetches the current total value of all investments for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user.
     * @returns {Promise<number>} A promise resolving to the current total value of all investments.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If there's a failure during database query or summation.
     */
    async currentTotalValue(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            const currentTotalValue = await this._investmentRepository.currentTotalValue(userId);
            return currentTotalValue;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Failed to fetch current total value:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Fetches the total returns (profit or loss) from all investments for the authenticated user.
     *
     * This method decodes the provided JWT access token to extract the user ID,
     * then retrieves the aggregated returns (e.g., total profit or loss) across all investment types.
     *
     * @param {string} accessToken - The JWT access token used to authenticate the user.
     * @returns {Promise<number>} A promise resolving to the total returns (profit or loss) from all investments.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If there's a failure during token decoding or database query.
     */
    async getTotalReturns(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            const totalReturns = await this._investmentRepository.getTotalReturns(userId);
            return totalReturns;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Failed to fetch total returns (profit or loss):', error);
            throw new Error((error as Error).message);
        }
    }
}

export default InvestmentService;