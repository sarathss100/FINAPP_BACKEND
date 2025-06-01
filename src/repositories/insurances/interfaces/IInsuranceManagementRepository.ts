import { InsuranceDTO } from 'dtos/insurances/insuranceDTO';

interface IInsuranceManagementRepository {
    createInsurance(insuranceData: InsuranceDTO, userId: string): Promise<InsuranceDTO>;
    removeInsurance(insuranceId: string): Promise<boolean>;
    getUserInsuranceCoverageTotal(userId: string): Promise<number>;
    getUserTotalPremiumAmount(userId: string): Promise<number>;
    getAllInsurances(userId: string): Promise<InsuranceDTO[]>;
    getClosestNextPaymentDate(userId: string): Promise<InsuranceDTO | null>;
    markPaymentAsPaid(insuranceId: string): Promise<boolean>;
    markExpiredInsurances(): Promise<void>;
}

export default IInsuranceManagementRepository;
