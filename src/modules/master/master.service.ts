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
}
