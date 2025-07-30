import IInsuranceDocument from '../../../model/insurances/interfaces/IInsurance';

export default interface IInsuranceRepository {
    createInsurance(insuranceData: Partial<IInsuranceDocument>, userId: string): Promise<IInsuranceDocument>;
    removeInsurance(insuranceId: string): Promise<IInsuranceDocument>;
    getUserInsuranceCoverageTotal(userId: string): Promise<number>;
    getUserTotalPremiumAmount(userId: string): Promise<number>;
    getAllInsurances(userId: string): Promise<IInsuranceDocument[]>;
    getClosestNextPaymentDate(userId: string): Promise<IInsuranceDocument>;
    markPaymentAsPaid(insuranceId: string): Promise<IInsuranceDocument>;
    markExpiredInsurances(): Promise<void>;
    getInsuranceForNotifyInsurancePayments(): Promise<IInsuranceDocument[]>;
}