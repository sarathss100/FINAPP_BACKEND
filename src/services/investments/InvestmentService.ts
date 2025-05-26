// import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
// import { AuthenticationError } from 'error/AppError';
// import { ErrorMessages } from 'constants/errorMessages';
// import { StatusCodes } from 'constants/statusCodes';
import IInvestmentService from './interfaces/IInvestmentService';
import InvestmentManagementRepository from 'repositories/investments/InvestmentManagementRepository';
import axios from 'axios';
import IStock from './interfaces/IStock';

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
}

export default InvestmentService;



// export class StockRepository {
//   private apiKey = process.env.ALPHA_VANTAGE_API_KEY as string;

//   public async searchStocks(keyword: string): Promise<any[]> {
//     const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords= ${keyword}&apikey=${this.apiKey}`;
//     const response = await axios.get(url);
//     return response.data.bestMatches || [];
//   }
// }
