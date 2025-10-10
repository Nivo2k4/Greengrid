import { prisma } from '../server.js';
class UserRepository {
    async FindByEmail(email) {
        return await prisma.user.findUnique({
            where: { email: email }
        });
    }
    async createUser(user) {
        return await prisma.user.create({
            data: user
        });
    }
}

export default new UserRepository();

