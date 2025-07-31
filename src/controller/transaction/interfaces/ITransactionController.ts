import { Request, Response } from 'express';

export default interface ITransactionController { 
    createTransaction(request: Request, response: Response): Promise<void>;
    getUserTransactions(request: Request, response: Response): Promise<void>;
    getMonthlyTotalIncome(request: Request, response: Response): Promise<void>;
    getWeeklyTotalIncome(request: Request, response: Response): Promise<void>;
    getMonthlyTotalExpense(request: Request, response: Response): Promise<void>;
    getCategoryWiseExpense(request: Request, response: Response): Promise<void>;
    extractTransactionData(request: Request, response: Response): Promise<void>;
    getAllIncomeTransactionsByCategory(request: Request, response: Response): Promise<void>;
    getAllExpenseTransactionsByCategory(request: Request, response: Response): Promise<void>;
    getMonthlyIncomeForChart(request: Request, response: Response): Promise<void>;
    getMonthlyExpenseForChart(request: Request, response: Response): Promise<void>;
    getPaginatedIncomeTransactions(request: Request, response: Response): Promise<void>;
    getPaginatedExpenseTransactions(request: Request, response: Response): Promise<void>;
    getPaginatedTransactions(request: Request, response: Response): Promise<void>;
}
