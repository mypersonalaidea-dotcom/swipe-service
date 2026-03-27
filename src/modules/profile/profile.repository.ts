import { prisma } from '../../config/database';

export class ProfileRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        job_experiences: { include: { company: true, position: true } },
        education_experiences: { include: { institution: true, degree: true } },
        user_habits: { include: { habit: true } },
        looking_for_habits: { include: { habit: true } },
        flats: {
          where: { status: 'active' },
          include: {
            rooms: {
              where: { status: 'active' },
              include: {
                room_amenities: { include: { amenity: true } },
                media: { where: { status: 'active' } }
              }
            },
            common_amenities: { include: { amenity: true } },
            media: { where: { status: 'active' } }
          }
        }
      }
    });
  }

  async updateProfile(id: string, data: any) {
    return prisma.user.update({ where: { id }, data });
  }

  // ----- Jobs -----
  async getJobs(userId: string) {
    return prisma.userJobExperience.findMany({
      where: { user_id: userId, status: 'active' },
      include: { company: true, position: true },
      orderBy: { display_order: 'asc' }
    });
  }

  async addJob(userId: string, data: any) {
    return prisma.userJobExperience.create({ data: { ...data, user_id: userId } });
  }

  async updateJob(jobId: string, userId: string, data: any) {
    return prisma.userJobExperience.updateMany({
      where: { id: jobId, user_id: userId },
      data
    });
  }

  async deleteJob(jobId: string, userId: string) {
    return prisma.userJobExperience.updateMany({
      where: { id: jobId, user_id: userId },
      data: { status: 'deleted' }
    });
  }

  // ----- Education -----
  async getEducation(userId: string) {
    return prisma.userEducationExperience.findMany({
      where: { user_id: userId, status: 'active' },
      include: { institution: true, degree: true },
      orderBy: { display_order: 'asc' }
    });
  }

  async addEducation(userId: string, data: any) {
    return prisma.userEducationExperience.create({ data: { ...data, user_id: userId } });
  }

  async updateEducation(eduId: string, userId: string, data: any) {
    return prisma.userEducationExperience.updateMany({
      where: { id: eduId, user_id: userId },
      data
    });
  }

  async deleteEducation(eduId: string, userId: string) {
    return prisma.userEducationExperience.updateMany({
      where: { id: eduId, user_id: userId },
      data: { status: 'deleted' }
    });
  }

  // ----- My Habits -----
  async getHabits(userId: string) {
    return prisma.userHabit.findMany({
      where: { user_id: userId, status: 'active' },
      include: { habit: true }
    });
  }

  async setHabits(userId: string, habitIds: string[]) {
    // Soft-delete all existing, then upsert new ones
    await prisma.userHabit.updateMany({ where: { user_id: userId }, data: { status: 'deleted' } });
    const creates = habitIds.map(habit_id =>
      prisma.userHabit.upsert({
        where: { user_id_habit_id: { user_id: userId, habit_id } },
        update: { status: 'active' },
        create: { user_id: userId, habit_id }
      })
    );
    return Promise.all(creates);
  }

  // ----- Looking-For Habits -----
  async getLookingForHabits(userId: string) {
    return prisma.userLookingForHabit.findMany({
      where: { user_id: userId, status: 'active' },
      include: { habit: true }
    });
  }

  async setLookingForHabits(userId: string, habitIds: string[]) {
    await prisma.userLookingForHabit.updateMany({ where: { user_id: userId }, data: { status: 'deleted' } });
    const creates = habitIds.map(habit_id =>
      prisma.userLookingForHabit.upsert({
        where: { user_id_habit_id: { user_id: userId, habit_id } },
        update: { status: 'active' },
        create: { user_id: userId, habit_id }
      })
    );
    return Promise.all(creates);
  }

  // ----- Search Preferences -----
  async getSearchPreferences(userId: string) {
    return prisma.userSearchPreference.findUnique({
      where: { user_id: userId },
    });
  }

  async upsertSearchPreferences(userId: string, data: any) {
    return prisma.userSearchPreference.upsert({
      where: { user_id: userId },
      update: data,
      create: { ...data, user_id: userId },
    });
  }
}
