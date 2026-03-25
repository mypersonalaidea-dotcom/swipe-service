import { prisma } from '../../config/database';

export class SearchPreferenceRepository {
  async findByUserId(userId: string) {
    return prisma.userSearchPreference.findUnique({
      where: { user_id: userId },
    });
  }

  async upsert(userId: string, data: any) {
    return prisma.userSearchPreference.upsert({
      where: { user_id: userId },
      update: { ...data, updated_at: new Date() },
      create: { ...data, user_id: userId },
    });
  }

  async delete(userId: string) {
    return prisma.userSearchPreference.deleteMany({
      where: { user_id: userId },
    });
  }

  // --- Filter Habits ---
  async getFilterHabits(userId: string) {
    return prisma.userFilterHabit.findMany({
      where: { user_id: userId },
      include: { habit: true },
    });
  }

  async setFilterHabits(userId: string, habits: { habit_id: string; filter_context: string }[]) {
    // Delete existing, then re-create
    await prisma.userFilterHabit.deleteMany({ where: { user_id: userId } });
    if (habits.length === 0) return [];
    const creates = habits.map(h =>
      prisma.userFilterHabit.create({
        data: { user_id: userId, habit_id: h.habit_id, filter_context: h.filter_context },
      })
    );
    return Promise.all(creates);
  }

  // --- Filter Amenities ---
  async getFilterAmenities(userId: string) {
    return prisma.userFilterAmenity.findMany({
      where: { user_id: userId },
      include: { amenity: true },
    });
  }

  async setFilterAmenities(userId: string, amenities: { amenity_id: string; amenity_context: string }[]) {
    await prisma.userFilterAmenity.deleteMany({ where: { user_id: userId } });
    if (amenities.length === 0) return [];
    const creates = amenities.map(a =>
      prisma.userFilterAmenity.create({
        data: { user_id: userId, amenity_id: a.amenity_id, amenity_context: a.amenity_context },
      })
    );
    return Promise.all(creates);
  }

  // --- Filter Companies ---
  async getFilterCompanies(userId: string) {
    return prisma.userFilterCompany.findMany({
      where: { user_id: userId },
      include: { company: true },
    });
  }

  async setFilterCompanies(userId: string, companyIds: string[]) {
    await prisma.userFilterCompany.deleteMany({ where: { user_id: userId } });
    if (companyIds.length === 0) return [];
    const creates = companyIds.map(company_id =>
      prisma.userFilterCompany.create({
        data: { user_id: userId, company_id },
      })
    );
    return Promise.all(creates);
  }

  // --- Filter Institutions ---
  async getFilterInstitutions(userId: string) {
    return prisma.userFilterInstitution.findMany({
      where: { user_id: userId },
      include: { institution: true },
    });
  }

  async setFilterInstitutions(userId: string, institutionIds: string[]) {
    await prisma.userFilterInstitution.deleteMany({ where: { user_id: userId } });
    if (institutionIds.length === 0) return [];
    const creates = institutionIds.map(institution_id =>
      prisma.userFilterInstitution.create({
        data: { user_id: userId, institution_id },
      })
    );
    return Promise.all(creates);
  }
}
