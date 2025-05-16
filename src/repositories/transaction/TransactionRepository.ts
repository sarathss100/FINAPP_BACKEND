import { ITransactionDTO } from 'dtos/transaction/TransactionDto';
import ITransactionRepository from './interfaces/ITransactionRepository';
import { TransactionModel } from 'model/transaction/model/TransactionModel';

class TransactionRepository implements ITransactionRepository {
  /**
    * Creates a new transaction history in the database and returns the created transaction in ITransactionDTO format.
    * 
    * This method takes an input object (`transactionData`) containing transaction details, inserts it into the database using the `TransactionModel`,
    * and maps the result to the `ITransactionDTO` format. MongoDB ObjectIds are converted to strings for consistency in the DTO.
    * 
    * @param {ITransactionDTO} transactionData - The input data representing the transaction to be created. Must conform to the ITransactionDTO structure.
    * @returns {Promise<ITransactionDTO>} - A promise resolving to the created transaction in ITransactionDTO format, with ObjectIds converted to strings.
    * @throws {Error} - Throws an error if the database operation fails or if invalid data is provided.
    */
    async createTransaction(data: ITransactionDTO): Promise<ITransactionDTO> { 
        try {
            const result = await TransactionModel.create(data);
            const createdTransaction: ITransactionDTO = {
                _id: result._id.toString(),
                user_id: result.user_id.toString(),
                account_id: result.account_id.toString(),
                transaction_type: result.transaction_type as 'INCOME' | 'EXPENSE',
                type: result.type,
                category: result.category,
                amount: result.amount,    
                currency: result.currency.toString() as 'INR',
                date: result.date,
                description: result.description,
                tags: result.tags,
                status: result.status,
                related_account_id: result.related_account_id?.toString(),
                linked_entities: result.linked_entities?.map((entity) => ({
                    entity_id: entity.entity_id?.toString(),
                    entity_type: entity.entity_type,
                    amount: entity.amount,
                    currency: entity.currency.toString() as 'INR',
                })),
                isDeleted: result.isDeleted || false,
                deletedAt: result.deletedAt,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
            };
            return createdTransaction;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all transactions associated with a specific user from the database.
     * 
     * @param {string} userId - The unique identifier of the user whose transactions are being retrieved.
     * @returns {Promise<ITransactionDTO[]>} - A promise resolving to an array of `ITransactionDTO` objects representing the user's transactions.
     * @throws {Error} - Throws an error if the database operation fails or no transactions are found for the given user.
     */
    async getUserTransactions(userId: string): Promise<ITransactionDTO[]> {
        try {
            // Query the database to retrieve all transactions associated with the given `userId`.
            const result = await TransactionModel.find<ITransactionDTO>({ user_id: userId });

            // it means no transactions were found for the given user, and an error is thrown.
            if (!result || result.length === 0) {
                throw new Error('No transactions found for the specified user');
            }

            // Return the retrieved transactions as an array of `ITransactionDTO` objects.
            return result;
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving transaction details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all transactions associated with a specific user from the database.
     * 
     * @param {string} userId - The unique identifier of the user whose transactions are being retrieved.
     * @returns {Promise<ITransactionDTO[]>} - A promise resolving to an array of `ITransactionDTO` objects representing the user's transactions.
     * @throws {Error} - Throws an error if the database operation fails or no transactions are found for the given user.
     */
    async getMonthlyTotalIncome(userId: string): Promise<{currentMonthTotal: number, previousMonthTotal: number }> {
        try {
            // Query the database to retrieve all transactions associated with the given `userId`.
            const result = await TransactionModel.find<ITransactionDTO>({ user_id: userId, transaction_type: 'INCOME' });

            // it means no transactions were found for the given user, and an error is thrown.
            if (!result || result.length === 0) {
                throw new Error('No transactions found for the specified user');
            }

            // Get the current date in UTC 
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth();

            // Previous month calculation
            const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

            let currentMonthTotal = 0;
            let previousMonthTotal = 0;

            result.forEach(transaction => {
                const date: Date = new Date(transaction.date);

                const transactionYear = date.getUTCFullYear();
                const transactionMonth = date.getUTCMonth();

                if (transactionYear === currentYear && transactionMonth === currentMonth) {
                    currentMonthTotal += transaction.amount;
                } else if (transactionYear === previousYear && transactionMonth === previousMonth) {
                    previousMonthTotal += transaction.amount;
                }
            });

            return { currentMonthTotal, previousMonthTotal };
        } catch (error) {
            // Log the error for debugging purposes.
            console.error('Error retrieving transaction details:', error);

            // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves and calculates the total amount of EXPENSE-type transactions 
     * made by a specific user in the current calendar month.
     *
     * Only transactions marked as type 'EXPENSE' and occurring in the current month 
     * are considered in the total calculation.
     *
     * @param {string} userId - The unique identifier of the user whose expense data is being retrieved.
     * @returns {Promise<number>} A promise resolving to the total expense amount for the current month.
     * @throws {Error} Throws an error if the database operation fails or if no matching transactions are found.
     */
    async getMonthlyTotalExpense(userId: string): Promise<number> {
        try {
            // Query the database for all EXPENSE transactions associated with the given user ID
            const result = await TransactionModel.find<ITransactionDTO>({
                user_id: userId,
                transaction_type: 'EXPENSE'
            });
        
            // If no matching expense transactions are found, throw an appropriate error
            if (!result || result.length === 0) {
                throw new Error('No expense transactions found for the specified user');
            }
        
            // Get current date in UTC to determine the current month and year
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth(); // 0-indexed (Jan=0, ..., Dec=11)
        
            let currentMonthExpenseTotal = 0;
        
            // Loop through each transaction to check if it belongs to the current month
            result.forEach(transaction => {
                const date: Date = new Date(transaction.date);
            
                const transactionYear = date.getUTCFullYear();
                const transactionMonth = date.getUTCMonth();
            
                // Add to the total only if the transaction occurred in the current month
                if (transactionYear === currentYear && transactionMonth === currentMonth) {
                    currentMonthExpenseTotal += transaction.amount;
                }
            });
        
            // Return the calculated total expense for the current month
            return currentMonthExpenseTotal;
        
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error calculating monthly expense total:', error);
        
            // Re-throw the error with a descriptive message
            throw new Error(`Failed to retrieve monthly expense total: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves and calculates the total amount of EXPENSE-type transactions 
     * made by a specific user in the current calendar month.
     *
     * Only transactions marked as type 'EXPENSE' and occurring in the current month 
     * are considered in the total calculation.
     *
     * @param {string} userId - The unique identifier of the user whose expense data is being retrieved.
     * @returns {Promise<number>} A promise resolving to the total expense amount for the current month.
     * @throws {Error} Throws an error if the database operation fails or if no matching transactions are found.
     */
    async getCategoryWiseExpense(userId: string): Promise<{category: string, value: number}[]> {
        try {
            // Query the database for all EXPENSE transactions associated with the given user ID
            const result = await TransactionModel.find<ITransactionDTO>({
                user_id: userId,
                transaction_type: 'EXPENSE'
            });
        
            // If no matching expense transactions are found, throw an appropriate error
            if (!result || result.length === 0) {
                throw new Error('No expense transactions found for the specified user');
            }
        
            // Get current date in UTC to determine the current month and year
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth(); // 0-indexed (Jan=0, ..., Dec=11)
        
            const categoryTotals: { [key: string]: number } = {};
        
            // Loop through each transaction to check if it belongs to the current month
            result.forEach(transaction => {
                const date: Date = new Date(transaction.date);
            
                const transactionYear = date.getUTCFullYear();
                const transactionMonth = date.getUTCMonth();
            
                // Add to the total only if the transaction occurred in the current month
                if (transactionYear === currentYear && transactionMonth === currentMonth) {
                    const category = transaction.category || 'MISCELLANEOUS';
                    categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
                }
            });

            // Convert object to array format 
            const getCategoryWiseExpenses = Object.entries(categoryTotals).map(([category, value]) => ({
                category,
                value
            }));

            // Return the calculated total expense for the current month
            return getCategoryWiseExpenses.sort((a, b) => b.value - a.value);
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error calculating monthly expense total:', error);
        
            // Re-throw the error with a descriptive message
            throw new Error(`Failed to retrieve monthly expense total: ${(error as Error).message}`);
        }
    }
}

export default TransactionRepository;
