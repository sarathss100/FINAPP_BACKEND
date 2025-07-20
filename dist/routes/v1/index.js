"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthRouter_1 = __importDefault(require("./auth/AuthRouter"));
const UserRouter_1 = __importDefault(require("./user/UserRouter"));
const AdminRouter_1 = __importDefault(require("./admin/AdminRouter"));
const PublicRouter_1 = __importDefault(require("./public/PublicRouter"));
const GoalRouter_1 = __importDefault(require("./goal/GoalRouter"));
const TransactionRouter_1 = __importDefault(require("./transaction/TransactionRouter"));
const AccountsRouter_1 = __importDefault(require("./accounts/AccountsRouter"));
const InvestmentRouter_1 = __importDefault(require("./investments/InvestmentRouter"));
const MutualFundRouter_1 = __importDefault(require("./mutualfunds/MutualFundRouter"));
const InsuranceRouter_1 = __importDefault(require("./insurances/InsuranceRouter"));
const debtRouter_1 = __importDefault(require("./debt/debtRouter"));
const ChatRouter_1 = __importDefault(require("./chats/ChatRouter"));
const NotificationRouter_1 = __importDefault(require("./notification/NotificationRouter"));
const SubscriptionRouter_1 = __importDefault(require("./subscription/SubscriptionRouter"));
const authMiddleware_1 = require("middleware/authMiddleware");
const roles_1 = require("types/auth/roles");
const requireSubscription_1 = require("middleware/requireSubscription");
const apiV1Router = (0, express_1.Router)();
// Public routes
apiV1Router.use('/public', PublicRouter_1.default);
apiV1Router.use('/auth', AuthRouter_1.default);
// Protected user routes 
apiV1Router.use('/user', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER, roles_1.UserRole.ADMIN), UserRouter_1.default);
apiV1Router.use('/goal', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER), requireSubscription_1.requireSubscription, GoalRouter_1.default);
apiV1Router.use('/transaction', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER), TransactionRouter_1.default);
apiV1Router.use('/accounts', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER), requireSubscription_1.requireSubscription, AccountsRouter_1.default);
apiV1Router.use('/investment', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER), requireSubscription_1.requireSubscription, InvestmentRouter_1.default);
apiV1Router.use('/mutualfund', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER, roles_1.UserRole.ADMIN), requireSubscription_1.requireSubscription, MutualFundRouter_1.default);
apiV1Router.use('/insurance', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER), requireSubscription_1.requireSubscription, InsuranceRouter_1.default);
apiV1Router.use('/debt', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER), requireSubscription_1.requireSubscription, debtRouter_1.default);
apiV1Router.use('/chat', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER, roles_1.UserRole.ADMIN), ChatRouter_1.default);
apiV1Router.use('/notification', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER), NotificationRouter_1.default);
apiV1Router.use('/subscription', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.USER), SubscriptionRouter_1.default);
// Admin-only routes
apiV1Router.use('/admin', (0, authMiddleware_1.authorizeRoles)(roles_1.UserRole.ADMIN), AdminRouter_1.default);
exports.default = apiV1Router;
