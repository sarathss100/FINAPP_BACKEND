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

/**
 * Service class for managing accounts, including creating, updating, deleting, and retrieving accounts.
 * This class interacts with the account repository to perform database operations.
 */
class InvestmentService implements IInvestmentService {
    private _investmentRepository: InvestmentManagementRepository;

    /**
     * Constructs a new instance of the AccountsService.
     * 
     * @param {IAccountsManagementRepository} accountRepository - The repository used for interacting with account data.
     */
    constructor(investmentRepository: InvestmentManagementRepository) {
        this._investmentRepository = investmentRepository;
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
}

export default InvestmentService;

