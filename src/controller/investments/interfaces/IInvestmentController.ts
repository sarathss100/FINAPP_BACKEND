import { Request, Response } from 'express';

interface IInvestmentController {
    searchStocks(request: Request, response: Response): Promise<void>;
}

export default IInvestmentController;
