import { Router } from 'express';
import authRoutes from './auth/AuthRouter';
import userRoutes from './user/UserRouter';
import adminRoutes from './admin/AdminRouter';
import publicRoutes from './public/PublicRouter';
import webHookRoutes from './onemoney/webhook.routes';
import goalRoutes from './goal/GoalRouter';
import router from './onemoney/api.routes';
import { authorizeRoles } from 'middleware/authMiddleware'; 
import { UserRole } from 'types/auth/roles';
const v1Router = Router();

v1Router.use('/public', publicRoutes);
v1Router.use('/onemoney', webHookRoutes);
v1Router.use('/api/onemoney', router);
v1Router.use('/auth', authRoutes);
v1Router.use('/user', authorizeRoles(UserRole.USER), userRoutes);
v1Router.use('/admin', authorizeRoles(UserRole.ADMIN), adminRoutes);
v1Router.use('/goal', authorizeRoles(UserRole.USER), goalRoutes);

export default v1Router;
