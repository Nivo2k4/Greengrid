import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import indexRoutes from './routes/index-routes.js';
import { errorHandler } from './middleware/error-middleware.js';
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials: true,
}))
// Use index routes
app.use('/api', indexRoutes);
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });

});app.use(errorHandler)

export default app;