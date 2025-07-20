"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PublicRepository_1 = __importDefault(require("repositories/public/PublicRepository"));
const PublicService_1 = __importDefault(require("services/public/PublicService"));
const publicController_1 = __importDefault(require("controller/public/publicController"));
const PublicRouter_1 = __importDefault(require("./PublicRouter"));
class PublicContainer {
    constructor() {
        const repository = new PublicRepository_1.default();
        const service = new PublicService_1.default(repository);
        this.controller = new publicController_1.default(service);
        this.router = (0, PublicRouter_1.default)(this.controller);
    }
}
exports.default = PublicContainer;
