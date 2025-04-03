import { Router } from 'express';
import authRoutes from './auth/AuthRouter';
import userRoutes from './user/UserRouter';
import adminRoutes from './admin/AdminRouter';
import { authorizeRoles } from 'middleware/authMiddleware'; 
import { UserRole } from 'types/auth/roles';
const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/user', authorizeRoles(UserRole.USER), userRoutes);
v1Router.use('/admin', authorizeRoles(UserRole.ADMIN), adminRoutes);

export default v1Router;
