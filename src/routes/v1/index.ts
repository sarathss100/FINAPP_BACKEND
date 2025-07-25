import { Router } from 'express';  
import AccountsContainer from './accounts/AccountContainer';
import AdminContainer from './admin/AdminContainer';
import AuthContainer from './auth/AuthContainer';
import ChatContainer from './chats/ChatContainer';
import DebtContainer from './debt/DebtContainer';
import GoalContainer from './goal/GoalContainer';
import InsuranceContainer from './insurances/InsuranceContainer';
import InvestmentContainer from './investments/InvestmentContainer';
import MutualFundContainer from './mutualfunds/MutualFundContainer';
import NotificationContainer from './notification/NotificationContainer';
import PublicContainer from './public/PublicContainer';
import SubscriptionContainer from './subscription/SubscriptionContainer';
import TransactionContainer from './transaction/TransactionContainer';
import UserContainer from './user/UserContainer';

import { authorizeRoles } from '../../middleware/authMiddleware'; 
import { UserRole } from '../../types/auth/roles';
import { requireSubscription } from '../../middleware/requireSubscription';
const apiV1Router = Router();

const accountsContainer = new AccountsContainer();
const adminContainer = new AdminContainer();
const authContainer = new AuthContainer();
const chatContainer = new ChatContainer();
const debtContainer = new DebtContainer();
const goalContainer = new GoalContainer();
const insuranceContainer = new InsuranceContainer();
const investmentContainer = new InvestmentContainer();
const mutualFundContainer = new MutualFundContainer();
const notificationContainer = new NotificationContainer();
const publicContainer = new PublicContainer();
const subscriptionContainer = new SubscriptionContainer();
const transactionContainer = new TransactionContainer();
const userContainer = new UserContainer();

// Public routes
apiV1Router.use('/public', publicContainer.router);
apiV1Router.use('/auth', authContainer.router);

// Protected user routes 
apiV1Router.use('/user', authorizeRoles(UserRole.USER, UserRole.ADMIN), userContainer.router);
apiV1Router.use('/goal', authorizeRoles(UserRole.USER), requireSubscription, goalContainer.router);
apiV1Router.use('/transaction', authorizeRoles(UserRole.USER), transactionContainer.router);
apiV1Router.use('/accounts', authorizeRoles(UserRole.USER), requireSubscription, accountsContainer.router);
apiV1Router.use('/investment', authorizeRoles(UserRole.USER), requireSubscription, investmentContainer.router);
apiV1Router.use('/mutualfund', authorizeRoles(UserRole.USER, UserRole.ADMIN), requireSubscription, mutualFundContainer.router);
apiV1Router.use('/insurance', authorizeRoles(UserRole.USER), requireSubscription, insuranceContainer.router);
apiV1Router.use('/debt', authorizeRoles(UserRole.USER), requireSubscription, debtContainer.router);
apiV1Router.use('/chat', authorizeRoles(UserRole.USER, UserRole.ADMIN), chatContainer.router);
apiV1Router.use('/notification', authorizeRoles(UserRole.USER), notificationContainer.router);
apiV1Router.use('/subscription', authorizeRoles(UserRole.USER), subscriptionContainer.router);

// Admin-only routes
apiV1Router.use('/admin', authorizeRoles(UserRole.ADMIN), adminContainer.router);

export default apiV1Router;