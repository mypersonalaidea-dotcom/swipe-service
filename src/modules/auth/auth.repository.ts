import { prisma } from '../../config/database';

export class AuthRepository {
  async createUser(data: any) {
    return prisma.user.create({ data });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}
