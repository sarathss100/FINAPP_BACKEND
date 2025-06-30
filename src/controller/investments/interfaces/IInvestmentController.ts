import { Request, Response } from 'express';

interface IInvestmentController {
    searchStocks(request: Request, response: Response): Promise<void>;
    createInvestment(request: Request, response: Response): Promise<void>;
    totalInvestedAmount(request: Request, response: Response): Promise<void>;
    currentTotalValue(request: Request, response: Response): Promise<void>;
}

export default IInvestmentController;
