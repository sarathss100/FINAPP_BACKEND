import { InsuranceDTO } from '../../../dtos/insurances/insuranceDTO';

interface IInsuranceManagementRepository {
    createInsurance(insuranceData: InsuranceDTO, userId: string): Promise<InsuranceDTO>;
    removeInsurance(insuranceId: string): Promise<InsuranceDTO | null>;
    getUserInsuranceCoverageTotal(userId: string): Promise<number>;
    getUserTotalPremiumAmount(userId: string): Promise<number>;
    getAllInsurances(userId: string): Promise<InsuranceDTO[]>;
    getClosestNextPaymentDate(userId: string): Promise<InsuranceDTO | null>;
    markPaymentAsPaid(insuranceId: string): Promise<InsuranceDTO>;
    markExpiredInsurances(): Promise<void>;
    getInsuranceForNotifyInsurancePayments(): Promise<InsuranceDTO[]>;
}

export default IInsuranceManagementRepository;
