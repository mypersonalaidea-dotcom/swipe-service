import { FlatsRepository } from './flats.repository';

const flatsRepo = new FlatsRepository();

export class FlatsService {
  async getFlats() {
    return await flatsRepo.getFlats();
  }

  async getFlatById(id: string) {
    return await flatsRepo.getFlatById(id);
  }

  async createFlat(data: any) {
    return await flatsRepo.createFlat(data);
  }
}
