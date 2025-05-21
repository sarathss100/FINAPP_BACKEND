import { Router } from 'express';
import TransactionRepository from 'repositories/transaction/TransactionRepository';
import TransactionService from 'services/transaction/TransactionService';
import TransactionController from 'controller/transaction/TransactionController';
import multer from 'multer';

// Initialize Multer with the in Memory Storage
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);
const transactionController = new TransactionController(transactionService);

// CRUD operations
router.post('/', transactionController.createTransaction.bind(transactionController));
router.get('/', transactionController.getUserTransactions.bind(transactionController));

// Summary reports
router.get('/summary/monthly/income', transactionController.getMonthlyTotalIncome.bind(transactionController));
router.get('/summary/monthly/expense', transactionController.getMonthlyTotalExpense.bind(transactionController));
router.get('/summary/category', transactionController.getCategoryWiseExpense.bind(transactionController));

// Statement upload
router.post('/statement', upload.single('file'), transactionController.extractTransactionData.bind(transactionController));

export default router;
