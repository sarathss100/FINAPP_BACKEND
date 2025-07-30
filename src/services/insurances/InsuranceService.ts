import IInsuranceService from './interfaces/IInsuranceService';
import InsuranceRepository from '../../repositories/insurances/InsuranceRepository';
import InsuranceDTO from '../../dtos/insurances/insuranceDTO';
import IInsuranceRepository from '../../repositories/insurances/interfaces/IInsuranceRepository';
import { eventBus } from '../../events/eventBus';
import { extractUserIdFromToken, wrapServiceError } from '../../utils/serviceUtils';
import InsuranceMapper from '../../mappers/insurances/InsuranceMapper';

export default class InsuranceService implements IInsuranceService {
    private static _instance: InsuranceService;
    private _insuranceRepository: IInsuranceRepository;

    constructor(insuranceRepository: IInsuranceRepository) {
        this._insuranceRepository = insuranceRepository;
    }

    public static get instance(): InsuranceService {
        if (!InsuranceService._instance) {
            const repo = InsuranceRepository.instance;
            InsuranceService._instance = new InsuranceService(repo);
        }
        return InsuranceService._instance;
    }

    async createInsurance(accessToken: string, insuranceData: InsuranceDTO): Promise<InsuranceDTO> {
        try {
            const userId = extractUserIdFromToken(accessToken);

            const refinedData = { ...insuranceData, status: insuranceData.payment_status === 'paid' ? 'active' : 'expired' };

            const mappedModel = InsuranceMapper.toModel(refinedData);

            // Delegate to the repository to create the insurance record
            const insuranceDetails = await this._insuranceRepository.createInsurance(mappedModel, userId);

            const resultDTO = InsuranceMapper.toDTO(insuranceDetails);

            // Emit socket event to notify user about debt Creation
            eventBus.emit('insurance_created', resultDTO);

            return resultDTO;
        } catch (error) {
            console.error('Error while creating insurance:', error);
            throw wrapServiceError(error);
        }
    }

    async removeInsurance(insuranceId: string): Promise<boolean> {
        try {
            // Delegate to the repository to delete the insurance record
            const insuranceDetails = await this._insuranceRepository.removeInsurance(insuranceId);

            const resultDTO = InsuranceMapper.toDTO(insuranceDetails);

            // Emit socket event to notify user about debt Creation
            eventBus.emit('insurance_removed', resultDTO);

            return !!resultDTO;
        } catch (error) {
            console.error('Error while removing insurance:', error);
            throw wrapServiceError(error);
        }
    }

    async getUserInsuranceCoverageTotal(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to calculate the total insurance coverage
            const totalInsuranceCoverage = await this._insuranceRepository.getUserInsuranceCoverageTotal(userId);
        
            return totalInsuranceCoverage;
        } catch (error) {
            console.error('Error while calculating insurance coverage total:', error);
            throw wrapServiceError(error);
        }
    }

    async getUserTotalPremiumAmount(accessToken: string): Promise<number> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to calculate the total insurance premium
            const totalPremium = await this._insuranceRepository.getUserTotalPremiumAmount(userId);
        
            return totalPremium;
        } catch (error) {
            console.error('Error while calculating total premium amount:', error);
            throw wrapServiceError(error);
        }
    }

    async getAllInsurances(accessToken: string): Promise<InsuranceDTO[]> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to fetch all insurance records for the user
            const insuranceDetails = await this._insuranceRepository.getAllInsurances(userId);

            const resultDTO = InsuranceMapper.toDTOs(insuranceDetails);
        
            return resultDTO;
        } catch (error) {
            console.error('Error while getting all insurances:', error);
            throw wrapServiceError(error);
        }
    }

    async getClosestNextPaymentDate(accessToken: string): Promise<InsuranceDTO> {
        try {
            const userId = extractUserIdFromToken(accessToken);
        
            // Delegate to the repository to fetch the closest next payment date for the user
            const insurance = await this._insuranceRepository.getClosestNextPaymentDate(userId);

            const resultDTO = InsuranceMapper.toDTO(insurance);
        
            return resultDTO;
        } catch (error) {
            console.error('Error while getting closest next payment date:', error);
            throw wrapServiceError(error);
        }
    }

    async markPaymentAsPaid(insuranceId: string): Promise<boolean> {
        try {
            // Delegate the update operation to the repository
            const insuranceDetails = await this._insuranceRepository.markPaymentAsPaid(insuranceId);

            const resultDTO = InsuranceMapper.toDTO(insuranceDetails);

            // Emit socket event to notify user about debt Creation
            eventBus.emit('insurance_paid', resultDTO);
        
            return !!resultDTO;
        } catch (error) {
            console.error('Error while marking payment status:', error);
            throw wrapServiceError(error);
        }
    }

    async markExpired(): Promise<void> {
        try {
            // Delegate the update operation to the repository
            await this._insuranceRepository.markExpiredInsurances();
        } catch (error) {
            console.error('Error while marking insurance expiry:', error);
            throw wrapServiceError(error);
        }
    }

    async getInsuranceForNotifyInsurancePayments(): Promise<InsuranceDTO[]> {
        try {
            // Delegate the fetch operation to the repository
            const insurances = await this._insuranceRepository.getInsuranceForNotifyInsurancePayments();

            const resultDTO = InsuranceMapper.toDTOs(insurances);

            return resultDTO; 
        } catch (error) {
            console.error('Error while creating notifications:', error);
            throw wrapServiceError(error);
        }
    }
}

