"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InvestmentManagementRepository_1 = __importDefault(require("repositories/investments/InvestmentManagementRepository"));
const InvestmentService_1 = __importDefault(require("services/investments/InvestmentService"));
const InvestmentController_1 = __importDefault(require("controller/investments/InvestmentController"));
const router = (0, express_1.Router)();
const investmentRepository = new InvestmentManagementRepository_1.default();
const investmentService = new InvestmentService_1.default(investmentRepository);
const investmentController = new InvestmentController_1.default(investmentService);
// CRUD 
router.post('/', investmentController.createInvestment.bind(investmentController));
// Search
router.get('/stock', investmentController.searchStocks.bind(investmentController));
exports.default = router;
