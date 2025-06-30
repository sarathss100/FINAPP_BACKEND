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
}

export default InvestmentManagementRepository;
