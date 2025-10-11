import { Router } from "express";
import { register } from "../controllers/auth-controller.js";
import { login } from "../controllers/auth-controller.js";

const route= Router();
route.post('/register', register);
route.post('/login', login)

export default route;