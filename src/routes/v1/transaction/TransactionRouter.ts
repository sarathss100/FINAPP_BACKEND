import { Router } from 'express';
import TransactionRepository from 'repositories/transaction/TransactionRepository';
import TransactionService from 'services/transaction/TransactionService';
import TransactionController from 'controller/transaction/TransactionController';

const router = Router();
const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);
const transactionController = new TransactionController(transactionService);

router.post('/create', transactionController.createTransaction.bind(transactionController));
router.get('/all', transactionController.getUserTransactions.bind(transactionController));

export default router;
