"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TransactionRepository_1 = __importDefault(require("repositories/transaction/TransactionRepository"));
const TransactionService_1 = __importDefault(require("services/transaction/TransactionService"));
const TransactionController_1 = __importDefault(require("controller/transaction/TransactionController"));
const multer_1 = __importDefault(require("multer"));
// Initialize Multer with the in Memory Storage
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
const transactionRepository = new TransactionRepository_1.default();
const transactionService = new TransactionService_1.default(transactionRepository);
const transactionController = new TransactionController_1.default(transactionService);
// CRUD operations
router.post('/', transactionController.createTransaction.bind(transactionController));
router.get('/', transactionController.getUserTransactions.bind(transactionController));
// Summary reports
router.get('/income/summary', transactionController.getPaginatedIncomeTransactions.bind(transactionController));
router.get('/expense/summary', transactionController.getPaginatedExpenseTransactions.bind(transactionController));
router.get('/summary/monthly/income', transactionController.getMonthlyTotalIncome.bind(transactionController));
router.get('/summary/monthly/expense', transactionController.getMonthlyTotalExpense.bind(transactionController));
router.get('/summary/weekly/income', transactionController.getWeeklyTotalIncome.bind(transactionController));
router.get('/summary/category', transactionController.getCategoryWiseExpense.bind(transactionController));
router.get('/summary/income-by-month', transactionController.getMonthlyIncomeForChart.bind(transactionController));
router.get('/summary/expense-by-month', transactionController.getMonthlyExpenseForChart.bind(transactionController));
// Speicific transactions 
router.get('/all', transactionController.getPaginatedTransactions.bind(transactionController));
router.get('/income/transactions', transactionController.getAllIncomeTransactionsByCategory.bind(transactionController));
router.get('/expense/transactions', transactionController.getAllExpenseTransactionsByCategory.bind(transactionController));
// Statement upload
router.post('/statement', upload.single('file'), transactionController.extractTransactionData.bind(transactionController));
exports.default = router;
