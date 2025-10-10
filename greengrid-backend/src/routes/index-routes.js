import { Router } from "express";
import authRoutes from './auth-routes.js';


const route= Router();

route.use('/auth', authRoutes);

export default route;