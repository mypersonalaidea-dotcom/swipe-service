import { MasterRepository } from './master.repository';

const masterRepo = new MasterRepository();

export class MasterService {
  async getDegrees() {
    return await masterRepo.getDegrees();
  }

  async getPositions() {
    return await masterRepo.getPositions();
  }

  async getCompanies() {
    return await masterRepo.getCompanies();
  }

  async getInstitutions() {
    return await masterRepo.getInstitutions();
  }

  async getHabits() {
    return await masterRepo.getHabits();
  }

  async getAmenities() {
    return await masterRepo.getAmenities();
  }

  async createDegree(data: any) {
    return await masterRepo.createDegree(data);
  }

  async createPosition(data: any) {
    return await masterRepo.createPosition(data);
  }

  async createCompany(data: any) {
    return await masterRepo.createCompany(data);
  }

  async createInstitution(data: any) {
    return await masterRepo.createInstitution(data);
  }
}
