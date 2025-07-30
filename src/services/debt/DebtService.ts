import IDebtService from './interfaces/IDebtService';
import IDebtDTO from '../../dtos/debt/DebtDTO';
import IDebtRepository from '../../repositories/debt/interfaces/IDebtRepository';
import calculateLoanBreakdown from '../../utils/debt/emiCalculator';
import { calculateLoanClosingMonth, calculateNextDueDate } from '../../utils/debt/dueDateCalculator';
import { categorizeDebt } from '../../utils/debt/debtCategorizer';
import { compareStrategies, ComparisonResult } from '../../utils/debt/simulateResult';
import { eventBus } from '../../events/eventBus';
import DebtRepository from '../../repositories/debt/DebtRepository';
import { extractUserIdFromToken, wrapServiceError } from '../../utils/serviceUtils';
import DebtMapper from '../../mappers/debts/DebtMapper';

export default class DebtService implements IDebtService {
    private static _instance: DebtService;
    private _debtRepository: IDebtRepository;

    constructor(debtRepository: IDebtRepository) {
        this._debtRepository = debtRepository;
    }

    public static get instance(): DebtService {
        if (!DebtService._instance) {
            const repo = DebtRepository.instance;
            DebtService._instance = new DebtService(repo);
        }
        return DebtService._instance;
    }

    async createDebt(accessToken: string, debtData: IDebtDTO): Promise<IDebtDTO> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            const monthlyPayment = await calculateLoanBreakdown({
                initialAmount: debtData.initialAmount,
                tenureMonths: debtData.tenureMonths,
                interestRate: debtData.interestRate ?? 0,
                interestType: debtData.interestType ?? 'simple',
                targetMonth: 1,
            });

            if (!debtData.startDate) {
                throw new Error('startDate is required to calculate loan closing month.');
            }
            const loanClosingMonth = calculateLoanClosingMonth(debtData.startDate, debtData.tenureMonths);
            const nextDueDate = calculateNextDueDate(debtData.startDate);
            const isGoodDebt = categorizeDebt(debtData.debtName);

            const refinedData = {
                ...debtData,
                monthlyPayment: monthlyPayment.emi,
                monthlyPrincipalPayment: monthlyPayment.principal,
                montlyInterestPayment: monthlyPayment.interest,
                nextDueDate,
                endDate: loanClosingMonth,
                currentBalance: debtData.initialAmount,
                isGoodDebt
            };

            delete refinedData._id;

            const mappedDocument = DebtMapper.toModel(refinedData);

            // Delegate to the repository to create the debt record
            const debtDetails = await this._debtRepository.createDebt(mappedDocument, userId);

            const resultDTO = DebtMapper.toDTO(debtDetails);

            // Emit socket event to notify user about debt Creation
            eventBus.emit('debt_created', resultDTO);

            return resultDTO;
        } catch (error) {
            console.error('Error while creating debt:', error);
            throw wrapServiceError(error);
        }
    }

    async getTotalDebt(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to calculate the total outstanding debt
            const totalDebt = await this._debtRepository.getTotalDebt(userId);
        
            return totalDebt;
        } catch (error) {
            console.error('Error while getting total debt:', error);
            throw wrapServiceError(error);
        }
    }

    async getTotalOutstandingDebt(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to calculate the total outstanding debt
            const totalOutstandingDebt = await this._debtRepository.getTotalOutstandingDebt(userId);
        
            return totalOutstandingDebt;
        } catch (error) {
            console.error('Error while getting total outstanding debt:', error);
            throw wrapServiceError(error);
        }
    }

    async getTotalMonthlyPayment(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to calculate the total monthly payment
            const totalMonthlyPayment = await this._debtRepository.getTotalMonthlyPayment(userId);
        
            return totalMonthlyPayment;
        } catch (error) {
            console.error('Error while getting total monthly debt payment:', error);
            throw wrapServiceError(error);
        }
    }

    async getLongestTenure(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to calculate the max tenure
            const maxTenure = await this._debtRepository.getLongestTenure(userId);
        
            return maxTenure;
        } catch (error) {
            console.error('Error while fetching longest tenure:', error);
            throw wrapServiceError(error);
        }
    }

    async getDebtCategorized(accessToken: string, category: string): Promise<IDebtDTO[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to fetch categorized debts
            const debtDetails = await this._debtRepository.getDebtCategorized(userId, category);

            const resultDTO = DebtMapper.toDTOs(debtDetails);
        
            return resultDTO;
        } catch (error) {
            console.error('Error while getting debt categorized:', error);
            throw wrapServiceError(error);
        }
    }

    async getRepaymentStrategyComparison(accessToken: string, extraAmount: number): Promise<ComparisonResult> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to fetch categorized debts
            const debtDetails = await this._debtRepository.getRepaymentStrategyComparison(userId);
        
            // Simulate Repayment and get the comparison result
            const comparisonResult = await compareStrategies(debtDetails, extraAmount);
        
            return comparisonResult;
        } catch (error) {
            console.error('Error while getting repayment startegy by comparison:', error);
            throw wrapServiceError(error);
        }
    }

    async getAllDebts(accessToken: string): Promise<IDebtDTO[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to fetch categorized debts
            const debtDetails = await this._debtRepository.getAllDebts(userId);

            const resultDTO = DebtMapper.toDTOs(debtDetails);

            return resultDTO;
        } catch (error) {
            console.error('Error while fetching all debts:', error);
            throw wrapServiceError(error);
        }
    }

    async deleteDebt(debtId: string): Promise<boolean> {
        try {
            // Delegate to the repository to delete the debt
            const removedDebt = await this._debtRepository.deleteDebt(debtId);

            const resultDTO = DebtMapper.toDTO(removedDebt);

            // Emit socket event to notify user about debt Creation
            eventBus.emit('debt_removed', resultDTO);
        
            return resultDTO._id ? true : false;
        } catch (error) {
            console.error('Error while deleting debt:', error);
            throw wrapServiceError(error);
        }
    }

    async updateExpiry(): Promise<void> {
        try {
            await this._debtRepository.updateExpiry();
        } catch (error) {
            console.error('Error while updating debt expiry:', error);
            throw wrapServiceError(error);
        }
    }

    async markEndedDebtsAsCompleted(): Promise<void> {
        try {
            await this._debtRepository.markEndedDebtsAsCompleted();
        } catch (error) {
            console.error('Error while mark all debts completed:', error);
            throw wrapServiceError(error);
        }
    }

    async markAsPaid(debtId: string): Promise<boolean> {
        try {
            // Delegate to the repository to mark the debt as paid
            const markAsPaid = await this._debtRepository.markAsPaid(debtId);
        
            return markAsPaid;
        } catch (error) {
            console.error('Error while debt mark as paid:', error);
            throw wrapServiceError(error);
        }
    }

    async getDebtsForNotifyUpcomingDebtPayments(): Promise<IDebtDTO[]> {
        try {
            // Fetch active debts from the repository for upcoming payment checks
            const debts = await this._debtRepository.getDebtForNotifyUpcomingDebtPayments();

            const resultDTO = DebtMapper.toDTOs(debts);

            return resultDTO;
        } catch (error) {
            console.error('Error while fetching upcoming debt payments:', error);
            throw wrapServiceError(error);
        }
    }
}
