"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MutualFundRouter_1 = __importDefault(require("./MutualFundRouter"));
const MutualFundRepository_1 = __importDefault(require("repositories/mutualfunds/MutualFundRepository"));
const MutualFundService_1 = __importDefault(require("services/mutualfunds/MutualFundService"));
const MutualFundController_1 = __importDefault(require("controller/mutualfunds/MutualFundController"));
class MutualFundContainer {
    constructor() {
        const repository = new MutualFundRepository_1.default();
        const service = new MutualFundService_1.default(repository);
        this.controller = new MutualFundController_1.default(service);
        this.router = (0, MutualFundRouter_1.default)(this.controller);
    }
}
exports.default = MutualFundContainer;
