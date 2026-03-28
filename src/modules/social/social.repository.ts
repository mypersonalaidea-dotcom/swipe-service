import { prisma } from '../../config/database';

export class SocialRepository {
  async saveProfile(userId: string, targetUserId: string) {
    return prisma.savedProfile.upsert({
      where: {
        user_id_saved_user_id: { user_id: userId, saved_user_id: targetUserId }
      },
      update: { status: 'active' },
      create: { user_id: userId, saved_user_id: targetUserId, status: 'active' }
    });
  }

  async unsaveProfile(userId: string, targetUserId: string) {
    return prisma.savedProfile.updateMany({
      where: { user_id: userId, saved_user_id: targetUserId },
      data: { status: 'deleted' }
    });
  }

  async getSavedProfiles(userId: string) {
    return prisma.savedProfile.findMany({
      where: { user_id: userId, status: 'active' },
      include: {
        saved_user: {
          include: {
            job_experiences: { include: { company: true, position: true } },
            education_experiences: { include: { institution: true, degree: true } },
            user_habits: { include: { habit: true } },
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
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async checkIfSaved(userId: string, targetUserId: string) {
    const record = await prisma.savedProfile.findUnique({
      where: { user_id_saved_user_id: { user_id: userId, saved_user_id: targetUserId } }
    });
    return record?.status === 'active';
  }
}
