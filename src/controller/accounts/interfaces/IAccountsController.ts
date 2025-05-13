import { Request, Response } from 'express';

interface IAccountsController {
    addAccount(request: Request, response: Response): Promise<void>;
    updateAccount(request: Request, response: Response): Promise<void>;
    removeAccount(request: Request, response: Response): Promise<void>;
    getUserAccounts(request: Request, response: Response): Promise<void>;
    getTotalBalance(request: Request, response: Response): Promise<void>;
    getTotalBankBalance(request: Request, response: Response): Promise<void>;
    getTotalDebt(request: Request, response: Response): Promise<void>;
    getTotalInvestment(request: Request, response: Response): Promise<void>;
}

export default IAccountsController;
