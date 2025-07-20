"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TransactionRepository_1 = __importDefault(require("repositories/transaction/TransactionRepository"));
const TransactionService_1 = __importDefault(require("services/transaction/TransactionService"));
const TransactionController_1 = __importDefault(require("controller/transaction/TransactionController"));
const TransactionRouter_1 = __importDefault(require("./TransactionRouter"));
class TransactionContainer {
    constructor() {
        const repository = new TransactionRepository_1.default();
        const service = new TransactionService_1.default(repository);
        this.controller = new TransactionController_1.default(service);
        this.router = (0, TransactionRouter_1.default)(this.controller);
    }
}
exports.default = TransactionContainer;
