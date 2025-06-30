"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MutualFundRepository_1 = __importDefault(require("repositories/mutualfunds/MutualFundRepository"));
const MutualFundController_1 = __importDefault(require("controller/mutualfunds/MutualFundController"));
const MutualFundService_1 = __importDefault(require("services/mutualfunds/MutualFundService"));
const router = (0, express_1.Router)();
const mutualFundRepository = new MutualFundRepository_1.default();
const mutualFundService = new MutualFundService_1.default(mutualFundRepository);
const mutualFundController = new MutualFundController_1.default(mutualFundService);
// CRUD operations
router.get('/nav', mutualFundController.syncNavData.bind(mutualFundController));
router.get('/search', mutualFundController.searchMutualFunds.bind(mutualFundController));
router.get('/', mutualFundController.getMutualFundDetails.bind(mutualFundController));
exports.default = router;
