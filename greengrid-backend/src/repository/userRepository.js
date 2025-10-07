import { PrismaClient } from "@prisma/client";
import AppError from "../exceptions/appError.js";

const prisma = new PrismaClient();

class UserRepository {
  async createUser(user) {
    try {
      return await prisma.user.create({ data: user });
    } catch (error) {
      throw new AppError(400, error.message);
    }
  }

  async getUsers() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      throw new AppError(400, error.message);
    }
  }
}

export default new UserRepository();

