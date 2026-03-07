import { prisma } from '../../config/database';

export class MasterRepository {
  async getDegrees() {
    return prisma.masterDegree.findMany({ where: { status: 'active' } });
  }

  async getPositions() {
    return prisma.masterPosition.findMany({ where: { status: 'active' } });
  }

  async getCompanies() {
    return prisma.masterCompany.findMany({ where: { status: 'active' } });
  }

  async getInstitutions() {
    return prisma.masterInstitution.findMany({ where: { status: 'active' } });
  }

  async getHabits() {
    return prisma.masterHabit.findMany({
      where: { status: 'active' },
      orderBy: { display_order: 'asc' },
    });
  }

  async getAmenities() {
    return prisma.masterAmenity.findMany({
      where: { status: 'active' },
      orderBy: { display_order: 'asc' },
    });
  }
}
