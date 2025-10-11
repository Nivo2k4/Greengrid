import { Router } from "express";
import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';

const route= Router();

route.use('/auth', authRoutes);
route.use('/user', userRoutes);

export default route;