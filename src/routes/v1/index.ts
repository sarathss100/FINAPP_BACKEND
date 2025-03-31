import { Router } from 'express';
import authRoutes from './auth/AuthRouter';
import userRoutes from './user/UserRouter';
const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/user', userRoutes);

export default v1Router;
