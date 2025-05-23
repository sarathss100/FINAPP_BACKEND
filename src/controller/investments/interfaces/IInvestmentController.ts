import { Request, Response } from 'express';

interface IInvestmentController {
    removeAccount(request: Request, response: Response): Promise<void>;
}

export default IInvestmentController;
