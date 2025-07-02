import { StockModel, MutualFundModel, BondModel, BusinessModel, ParkingFundModel, EPFOModel, FixedDepositModel, GoldModel, PropertyModel } from 'model/investments/model/InvestmentModel';
import IInvestmentManagementRepository from './interfaces/IInvestmentManagementRepository';
import { InvestmentDTO } from 'dtos/investments/investmentDTO';
import mongoose from 'mongoose';

const modelMap = {
    STOCK: StockModel,
    MUTUAL_FUND: MutualFundModel,
    BOND: BondModel,
    PROPERTY: PropertyModel,
    BUSINESS: BusinessModel,
    FIXED_DEPOSIT: FixedDepositModel,
    EPFO: EPFOModel,
    GOLD: GoldModel,
    PARKING_FUND: ParkingFundModel,
};

class InvestmentManagementRepository implements IInvestmentManagementRepository {
    private static _instance: IInvestmentManagementRepository;

    /**
     * Private constructor to enforce singleton pattern.
     */
    public constructor() {}

    /**
     * Gets the singleton instance of InvestmentManagementRepository
     * 
     * @returns {IInvestmentManagementRepository}
     */
    public static get instance(): IInvestmentManagementRepository {
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
    async createInvestment(investmentData: InvestmentDTO, userId: string): Promise<InvestmentDTO> {
        try {
            const mongooseUserId = new mongoose.Types.ObjectId(userId);
            const relatedAccount = new mongoose.Types.ObjectId(investmentData.relatedAccount);

            const Model = modelMap[investmentData.type];
            if (!Model) throw new Error('Invalid investment type');

            const investmentDoc = await Model.create({
                ...investmentData,
                userId: mongooseUserId,
                relatedAccount 
            });

            const plainInvestment = investmentDoc.toObject()

            return plainInvestment as unknown as InvestmentDTO;
        } catch (error) {
            console.error('Error creating investment:', error);
            throw new Error(`Failed to create investment: ${(error as Error).message}`);
        }
    }

    /**
     * Fetches all investments of a specific type from the database.
     *
     * @param {string} investmentType - The type of investment to retrieve (e.g., STOCK, MUTUAL_FUND).
     * @returns {Promise<InvestmentDTO[]>} - A promise resolving to an array of investment DTOs.
     * @throws {Error} - Throws an error if the investment type is invalid or the database operation fails.
     */
    async getInvestments(investmentType: string): Promise<InvestmentDTO[]> {
        try {
            const Model = modelMap[investmentType as keyof typeof modelMap];

            if (!Model) {
                throw new Error(`Invalid investment type: ${investmentType}`);
            }

            // Fetch all documents for this investment type
            const investmentDocs = await Model.find(); 

            // Convert Mongoose documents to plain objects and return as InvestmentDTO[]
            const plainInvestments = investmentDocs.map(doc => doc.toObject());

            return plainInvestments as unknown as InvestmentDTO[];
        } catch (error) {
            console.error('Error fetching investments:', error);
            throw new Error(`Failed to fetch investments: ${(error as Error).message}`);
        }
    }

    /**
     * Updates multiple investment documents in bulk for the same investment type.
     *
     * @param {InvestmentDTO[]} investments - An array of investment DTOs to be updated.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the investment type is invalid or the database operation fails.
     */
    async updateInvestmentBulk(investments: InvestmentDTO[]): Promise<void> {
        try {
            if (!investments.length) return;
            const investmentType = investments[0].type;
            const Model = modelMap[investmentType];

            if (!Model) throw new Error(`Invalid investment type: ${investmentType}`);

            // Prepare bulk operations
            const operations = investments.map((investment) => ({
                updateOne: {
                    filter: { _id: investment._id },
                    update: { $set: investment },
                },
            }));

            // Perform the bulk write 
            await Model.bulkWrite(operations, { ordered: false }); // ordered: false continues on error
        } catch (error) {
            console.error('Error fetching investments:', error);
            throw new Error(`Failed to fetch investments: ${(error as Error).message}`);
        }
    }

    /**
     * Calculates the total initial investment amount across all investment types for a given user.
     *
     * @param {string} userId - The ID of the user whose investments are to be summed.
     * @returns {Promise<number>} A promise resolving to the total initial investment amount.
     * @throws {Error} If there's a failure during database query or summation.
     */
    async totalInvestment(userId: string): Promise<number> {
        try {
            let total = 0;
            for (const Model of Object.values(modelMap)) {
                const result = await Model.aggregate([
                    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                    {
                        $group: {
                            _id: null,
                            totalInitialAmount: { $sum: '$initialAmount' }
                        }
                    }
                ]);

                total += result[0]?.totalInitialAmount || 0;
            }

            return total;

        } catch (error) {
            console.error('Error calculating total investment:', error);
            throw new Error(`Failed to calculate total investment: ${(error as Error).message}`);
        }
    }

    /**
     * Calculates the current total value across all investment types for a given user.
     *
     * @param {string} userId - The ID of the user whose investments are to be summed.
     * @returns {Promise<number>} A promise resolving to the current total value of all investments.
     * @throws {Error} If there's a failure during database query or summation.
     */
    async currentTotalValue(userId: string): Promise<number> {
        try {
            let total = 0;
            for (const Model of Object.values(modelMap)) {
                const result = await Model.aggregate([
                    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                    {
                        $group: {
                            _id: null,
                            currentTotalValue: { $sum: '$currentValue' }
                        }
                    }
                ]);

                total += result[0]?.currentTotalValue || 0;
            }

            return total;

        } catch (error) {
            console.error('Error calculating current total value:', error);
            throw new Error(`Failed to calculate current total value: ${(error as Error).message}`);
        }
    }

    /**
     * Calculates the total returns (profit or loss) across all investment types for a given user.
     *
     * This function iterates over all investment models mapped in `modelMap`, performs an aggregation
     * to sum the 'totalProfitOrLoss' field for investments belonging to the specified user,
     * and returns the combined total.
     *
     * @param {string} userId - The ID of the user whose investment returns are to be summed.
     * @returns {Promise<number>} A promise resolving to the total returns (profit or loss) from all investments.
     * @throws {Error} If there's a failure during database query or summation.
     */
    async getTotalReturns(userId: string): Promise<number> {
        try {
            let total = 0;

            // Iterate through each investment model (e.g., stocks, crypto, mutual funds)
            for (const Model of Object.values(modelMap)) {
                // Aggregate total profit or loss for the current investment type and user
                const result = await Model.aggregate([
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(userId)
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
                total += result[0]?.currentTotalValue || 0;
            }

            return total;

        } catch (error) {
            // Log detailed error and re-throw with context
            console.error('Error calculating total returns (profit or loss):', error);
            throw new Error(`Failed to calculate total returns: ${(error as Error).message}`);
        }
    }

    /**
 * Fetches all investment records for a given user across all investment types.
 *
 * @param {string} userId - The ID of the user whose investments are to be fetched.
 * @returns {Promise<InvestmentDTO[]>} A promise resolving to an array of investment DTOs.
 * @throws {Error} If there's a failure during database query or mapping.
 */
/**
     * Fetches all investments for a given user and categorizes them by investment type.
     *
     * @param userId - The ID of the user whose investments are to be fetched and categorized.
     * @returns A promise resolving to an object where keys are investment types and values are arrays of corresponding investments.
     * @throws Error if the database query fails.
     */
    async getCategorizedInvestments(userId: string): Promise<Record<string, InvestmentDTO[]>> {
        try {
            const categorizedInvestments: Record<string, InvestmentDTO[]> = {};
            const mongooseUserId = new mongoose.Types.ObjectId(userId);

            // Loop through each investment model (e.g., StockModel, MutualFundModel)
            for (const Model of Object.values(modelMap)) {
                // Fetch all investments of this type belonging to the user
                const result = await Model.aggregate([
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
                const investments = result.map(doc => doc as InvestmentDTO);

                // Determine category from model or individual document
                const category = investments[0]?.type;

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

        } catch (error) {
            console.error('Error fetching and categorizing investments:', error);
            throw new Error(`Failed to fetch and categorize investments: ${(error as Error).message}`);
        }
    }

    /**
     * Deletes a single investment document by ID for a given investment type.
     *
     * @param {string} investmentType - The type of investment (e.g., STOCK, MUTUAL_FUND).
     * @param {string} investmentId - The ID of the investment document to delete.
     * @returns {Promise<void>}
     * @throws {Error} If the investment type is invalid or database operation fails.
     */
    async removeInvestment(investmentType: string, investmentId: string): Promise<void> {
        try {
            const Model = modelMap[investmentType as keyof typeof modelMap];
            if (!Model) {
                throw new Error(`Invalid investment type: ${investmentType}`);
            }

            // Convert investmentId to ObjectId
            const mongooseId = new mongoose.Types.ObjectId(investmentId);

            // Delete the document
            const result = await Model.deleteOne({ _id: mongooseId });

            if (result.deletedCount === 0) {
                throw new Error(`No investment found with ID: ${investmentId}`);
            } 
        } catch (error) {
            console.error('Error deleting investment:', error);
            throw new Error(`Failed to delete investment: ${(error as Error).message}`);
        }
    }
}

export default InvestmentManagementRepository;