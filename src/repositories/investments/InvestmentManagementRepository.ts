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
    public constructor() {}

    public static get instance(): IInvestmentManagementRepository {
        if (!InvestmentManagementRepository._instance) {
            InvestmentManagementRepository._instance = new InvestmentManagementRepository();
        }
        return InvestmentManagementRepository._instance;
    }
    
    // Creates a new investment in the database.
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

    // Fetches all investments of a specific type from the database.
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
            throw new Error(`Failed to fetch investments`);
        }
    }

    // Updates multiple investment documents in bulk for the same investment type.
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

    // Calculates the total initial investment amount across all investment types for a given user.
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
            throw new Error(`Failed to calculate total investment`);
        }
    }

    // Calculates the current total value across all investment types for a given user.
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
            throw new Error(`Failed to calculate current total value`);
        }
    }

    // Calculates the total returns (profit or loss) across all investment types for a given user.
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
            throw new Error(`Failed to calculate total returns`);
        }
    }

    // Fetches all investments for a given user and categorizes them by investment type.
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
            throw new Error(`Failed to fetch and categorize investments`);
        }
    }

    // Deletes a single investment document by ID for a given investment type.
    async removeInvestment(investmentType: string, investmentId: string): Promise<InvestmentDTO> {
        try {
            const Model = modelMap[investmentType as keyof typeof modelMap];
            if (!Model) {
                throw new Error(`Invalid investment type: ${investmentType}`);
            }

            // Convert investmentId to ObjectId
            const mongooseId = new mongoose.Types.ObjectId(investmentId);

            // Find the document before deletion
            const investment = await Model.findById(mongooseId);
            if (!investment) {
                throw new Error(`No investment found with ID: ${investmentId}`);
            }

            // Delete the document
            const result = await Model.deleteOne({ _id: mongooseId });

            if (result.deletedCount === 0) {
                throw new Error(`Failed to delete investment with ID: ${investmentId}`);
            }

            const plainInvestment = investment.toObject();

            return plainInvestment as unknown as InvestmentDTO;
        } catch (error) {
            console.error('Error deleting investment:', error);
            throw new Error(`Failed to delete investment: ${(error as Error).message}`);
        }
    }
}

export default InvestmentManagementRepository;