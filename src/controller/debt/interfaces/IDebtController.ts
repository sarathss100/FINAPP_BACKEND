import { Request, Response } from 'express';

interface IDebtController {
    createDebt(request: Request, response: Response): Promise<void>;
    getTotalDebt(request: Request, response: Response): Promise<void>;
    getTotalOutstandingDebt(request: Request, response: Response): Promise<void>;
    getTotalMonthlyPayment(request: Request, response: Response): Promise<void>;
    getLongestTenure(request: Request, response: Response): Promise<void>;
    getDebtCategorized(request: Request, response: Response): Promise<void>;
    getRepaymentStrategyComparison(request: Request, response: Response): Promise<void>;
}

export default IDebtController;
