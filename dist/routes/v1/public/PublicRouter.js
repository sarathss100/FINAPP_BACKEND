"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PublicRepository_1 = __importDefault(require("repositories/public/PublicRepository"));
const PublicService_1 = __importDefault(require("services/public/PublicService"));
const publicController_1 = __importDefault(require("controller/public/publicController"));
const router = (0, express_1.Router)();
const publicRepository = new PublicRepository_1.default();
const publicService = new PublicService_1.default(publicRepository);
const publicController = new publicController_1.default(publicService);
router.get('/faq', publicController.getFaqs.bind(publicController));
exports.default = router;
