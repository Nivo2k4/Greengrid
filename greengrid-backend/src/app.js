import express from 'express';
import indexRoutes from './routes/index-routes.js';
import { errorHandler } from './middleware/error-middleware.js';

const app = express();

app.use(express.json());
// Use index routes
app.use('/api', indexRoutes);
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });

});app.use(errorHandler)

export default app;