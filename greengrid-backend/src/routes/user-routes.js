import { Router } from "express";
import { getCurrentUser } from "../controllers/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router= Router();
router.get('/me',authMiddleware,getCurrentUser);
export default router;