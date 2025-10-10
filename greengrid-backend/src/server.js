import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const PORT = process.env.PORT;

app.listen(PORT,()=> {
      console.log(`server is running on http://localhost:${PORT}`);
})