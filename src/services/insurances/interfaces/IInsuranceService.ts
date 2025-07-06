import { InsuranceDTO } from 'dtos/insurances/insuranceDTO';

interface IInsuranceService {
    createInsurance(accessToken: string, insuranceData: InsuranceDTO): Promise<InsuranceDTO>;
    removeInsurance(insuranceId: string): Promise<boolean>;
    getUserInsuranceCoverageTotal(accessToken: string): Promise<number>;
    getUserTotalPremiumAmount(accessToken: string): Promise<number>;
    getAllInsurances(accessToken: string): Promise<InsuranceDTO[]>;
    getClosestNextPaymentDate(accessToken: string): Promise<InsuranceDTO | null>;
    markPaymentAsPaid(insuranceId: string): Promise<boolean>;
    markExpired(): Promise<void>;
    getInsuranceForNotifyInsurancePayments(): Promise<InsuranceDTO[]>;
}

export default IInsuranceService;

