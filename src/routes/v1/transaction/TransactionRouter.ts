import { Router } from 'express';
import TransactionRepository from '../../../repositories/transaction/TransactionRepository';
import TransactionService from '../../../services/transaction/TransactionService';
import TransactionController from '../../../controller/transaction/TransactionController';
import multer from 'multer';
import ITransactionController from '../../../controller/transaction/interfaces/ITransactionController';

const upload = multer({ storage: multer.memoryStorage() });

const createTransactionRouter = function(transactionController: ITransactionController): Router {
    const router = Router();

    router.post('/', transactionController.createTransaction.bind(transactionController));
    router.get('/', transactionController.getUserTransactions.bind(transactionController));
    router.get('/income/summary', transactionController.getPaginatedIncomeTransactions.bind(transactionController));
    router.get('/expense/summary', transactionController.getPaginatedExpenseTransactions.bind(transactionController));
    router.get('/summary/monthly/income', transactionController.getMonthlyTotalIncome.bind(transactionController));
    router.get('/summary/monthly/expense', transactionController.getMonthlyTotalExpense.bind(transactionController));
    router.get('/summary/weekly/income', transactionController.getWeeklyTotalIncome.bind(transactionController));
    router.get('/summary/category', transactionController.getCategoryWiseExpense.bind(transactionController));
    router.get('/summary/income-by-month', transactionController.getMonthlyIncomeForChart.bind(transactionController));
    router.get('/summary/expense-by-month', transactionController.getMonthlyExpenseForChart.bind(transactionController));
    router.get('/all', transactionController.getPaginatedTransactions.bind(transactionController));
    router.get('/income/transactions', transactionController.getAllIncomeTransactionsByCategory.bind(transactionController));
    router.get('/expense/transactions', transactionController.getAllExpenseTransactionsByCategory.bind(transactionController));
    router.post('/statement', upload.single('file'), transactionController.extractTransactionData.bind(transactionController));

    return router;
};

export default createTransactionRouter;