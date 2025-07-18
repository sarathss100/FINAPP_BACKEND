import { Router } from 'express';
import authRoutes from './auth/AuthRouter';
import userRoutes from './user/UserRouter';
import adminRoutes from './admin/AdminRouter';
import publicRoutes from './public/PublicRouter';
import goalRoutes from './goal/GoalRouter';
import transactionRoutes from './transaction/TransactionRouter';
import accountsRoutes from './accounts/AccountsRouter';
import investmentRoutes from './investments/InvestmentRouter';
import mutualFundRoutes from './mutualfunds/MutualFundRouter';
import insuranceRoutes from './insurances/InsuranceRouter';
import debtRoutes from './debt/debtRouter';
import chatRoutes from './chats/ChatRouter';
import notificationRoutes from './notification/NotificationRouter';
import subscriptionRoutes from './subscription/SubscriptionRouter';

import { authorizeRoles } from 'middleware/authMiddleware'; 
import { UserRole } from 'types/auth/roles';
import { requireSubscription } from 'middleware/requireSubscription';
const apiV1Router = Router();

// Public routes
apiV1Router.use('/public', publicRoutes);
apiV1Router.use('/auth', authRoutes);

// Protected user routes 
apiV1Router.use('/user', authorizeRoles(UserRole.USER, UserRole.ADMIN), userRoutes);
apiV1Router.use('/goal', authorizeRoles(UserRole.USER), requireSubscription, goalRoutes);
apiV1Router.use('/transaction', authorizeRoles(UserRole.USER), transactionRoutes);
apiV1Router.use('/accounts', authorizeRoles(UserRole.USER), requireSubscription, accountsRoutes);
apiV1Router.use('/investment', authorizeRoles(UserRole.USER), requireSubscription, investmentRoutes);
apiV1Router.use('/mutualfund', authorizeRoles(UserRole.USER, UserRole.ADMIN), requireSubscription, mutualFundRoutes);
apiV1Router.use('/insurance', authorizeRoles(UserRole.USER), requireSubscription, insuranceRoutes);
apiV1Router.use('/debt', authorizeRoles(UserRole.USER), requireSubscription, debtRoutes);
apiV1Router.use('/chat', authorizeRoles(UserRole.USER, UserRole.ADMIN), chatRoutes);
apiV1Router.use('/notification', authorizeRoles(UserRole.USER), notificationRoutes);
apiV1Router.use('/subscription', authorizeRoles(UserRole.USER), subscriptionRoutes);

// Admin-only routes
apiV1Router.use('/admin', authorizeRoles(UserRole.ADMIN), adminRoutes);

export default apiV1Router;
