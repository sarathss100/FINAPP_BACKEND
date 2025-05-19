import { Request, Response } from 'express';

interface ITransactionController { 
    createTransaction(request: Request, response: Response): Promise<void>;
    getUserTransactions(request: Request, response: Response): Promise<void>;
    getMonthlyTotalIncome(request: Request, response: Response): Promise<void>;
    getMonthlyTotalExpense(request: Request, response: Response): Promise<void>;
    getCategoryWiseExpense(request: Request, response: Response): Promise<void>;
    extractTransactionData(request: Request, response: Response): Promise<void>;
}

export default ITransactionController;
