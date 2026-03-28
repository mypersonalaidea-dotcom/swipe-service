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

  async createDegree(data: { full_name: string; common_name: string; other_names: string[]; submitted_by?: string }) {
    return prisma.masterDegree.create({
      data: {
        ...data,
        is_verified: false,
        status: 'active',
      },
    });
  }

  async createPosition(data: { full_name: string; common_name: string; other_names: string[]; submitted_by?: string }) {
    return prisma.masterPosition.create({
      data: {
        ...data,
        is_verified: false,
        status: 'active',
      },
    });
  }

  async createCompany(data: { name: string; logo_url?: string; aliases: string[]; submitted_by?: string }) {
    return prisma.masterCompany.create({
      data: {
        ...data,
        is_verified: false,
        status: 'active',
      },
    });
  }

  async createInstitution(data: { name: string; logo_url?: string; aliases: string[]; submitted_by?: string }) {
    return prisma.masterInstitution.create({
      data: {
        ...data,
        is_verified: false,
        status: 'active',
      },
    });
  }
}
