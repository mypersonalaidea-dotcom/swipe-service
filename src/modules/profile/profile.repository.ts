import { prisma } from '../../config/database';

export class ProfileRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        job_experiences: { include: { company: true, position: true } },
        education_experiences: { include: { institution: true, degree: true } },
        user_habits: { include: { habit: true } },
        looking_for_habits: { include: { habit: true } }
      }
    });
  }

  async updateProfile(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data
    });
  }
}
