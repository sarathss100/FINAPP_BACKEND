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

router.post('/create', transactionController.createTransaction.bind(transactionController));
router.get('/all', transactionController.getUserTransactions.bind(transactionController));
router.get('/monthly-total-income', transactionController.getMonthlyTotalIncome.bind(transactionController));
router.get('/monthly-total-expense', transactionController.getMonthlyTotalExpense.bind(transactionController));
router.get('/category-wise-expense', transactionController.getCategoryWiseExpense.bind(transactionController));
router.post('/statement-data', upload.single('file'), transactionController.extractTransactionData.bind(transactionController));

export default router;
