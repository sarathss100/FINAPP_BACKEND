import { Router } from 'express';
import authRoutes from './auth/AuthRouter';
import userRoutes from './user/UserRouter';
import adminRoutes from './admin/AdminRouter';
const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/user', userRoutes);
v1Router.use('/admin', adminRoutes);

export default v1Router;
