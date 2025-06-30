"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/envConfig/envConfig"); // Load dotenv globally
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const LoggingMiddleware_1 = __importDefault(require("./middleware/LoggingMiddleware"));
const routes_1 = __importDefault(require("./routes/routes"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("utils/middleware/corsOptions"));
// import rateLimiter from 'utils/middleware/rateLimiter';
const helmet_1 = __importDefault(require("helmet"));
require("./cron/scheduler");
const expireInsurances_1 = __importDefault(require("./cron/expireInsurances"));
const DebtMonthlyExpiry_1 = __importDefault(require("./cron/DebtMonthlyExpiry"));
const markEndedDebtsAsCompleted_ts_1 = __importDefault(require("./cron/markEndedDebtsAsCompleted.ts"));
const updateStockPrices_1 = __importDefault(require("cron/updateStockPrices"));
const app = (0, express_1.default)();
expireInsurances_1.default.start();
DebtMonthlyExpiry_1.default.start();
markEndedDebtsAsCompleted_ts_1.default.start();
updateStockPrices_1.default.start();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(LoggingMiddleware_1.default);
app.use((0, cors_1.default)(corsOptions_1.default));
app.use((0, helmet_1.default)());
// app.use(rateLimiter);
app.use('/api', routes_1.default);
// Server Health Check
app.get('/', (req, res) => {
    res.status(200).json('Server is up and Running');
});
exports.default = app;
