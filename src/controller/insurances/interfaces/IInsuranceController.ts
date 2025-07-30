import { Request, Response } from 'express';

export default interface IInsuranceController {
    createInsurance(request: Request, response: Response): Promise<void>;
    removeInsurance(request: Request, response: Response): Promise<void>;
    getUserInsuranceCoverageTotal(request: Request, response: Response): Promise<void>;
    getUserTotalPremiumAmount(request: Request, response: Response): Promise<void>;
    getAllInsurances(request: Request, response: Response): Promise<void>;
    getClosestNextPaymentDate(request: Request, response: Response): Promise<void>;
    markPaymentAsPaid(request: Request, response: Response): Promise<void>;
}
