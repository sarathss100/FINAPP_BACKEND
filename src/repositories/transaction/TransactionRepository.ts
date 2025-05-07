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
                tenant_id: result.tenat_id?.toString(),
                account_id: result.account_id.toString(),
                type: result.type,
                category: result.category,
                amount: result.amount,    
                currency: result.currency.toString() as 'USD' | 'EUR' | 'INR' | 'GBP',
                date: result.date,
                description: result.description,
                tags: result.tags,
                status: result.status,
                related_account_id: result.related_account_id?.toString(),
                linked_entities: result.linked_entities?.map((entity) => ({
                    entity_id: entity.entity_id?.toString(),
                    entity_type: entity.entity_type,
                    amount: entity.amount,
                    currency: entity.currency.toString() as 'USD' | 'EUR' | 'INR' | 'GBP',
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
}

export default TransactionRepository;
