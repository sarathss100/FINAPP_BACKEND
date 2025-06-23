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
}

export default InvestmentManagementRepository;
