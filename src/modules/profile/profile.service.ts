import { ProfileRepository } from './profile.repository';

const profileRepo = new ProfileRepository();

export class ProfileService {
  async getProfile(id: string) {
    const profile = await profileRepo.findById(id);
    if (!profile) throw new Error('Profile not found');
    const { password_hash: _, ...safeProfile } = profile as any;
    return safeProfile;
  }

  async updateProfile(id: string, data: any) {
    const safeData: Record<string, any> = {
      name: data.name,
      age: data.age,
      gender: data.gender,
      city: data.city,
      state: data.state,
      search_type: data.search_type,
      is_published: data.is_published
    };
    Object.keys(safeData).forEach(key => safeData[key] === undefined && delete safeData[key]);
    const updated = await profileRepo.updateProfile(id, safeData);
    const { password_hash: _, ...safeProfile } = updated as any;
    return safeProfile;
  }

  // ----- Jobs -----
  async getJobs(userId: string) {
    return profileRepo.getJobs(userId);
  }

  async addJob(userId: string, data: any) {
    return profileRepo.addJob(userId, data);
  }

  async updateJob(jobId: string, userId: string, data: any) {
    return profileRepo.updateJob(jobId, userId, data);
  }

  async deleteJob(jobId: string, userId: string) {
    return profileRepo.deleteJob(jobId, userId);
  }

  // ----- Education -----
  async getEducation(userId: string) {
    return profileRepo.getEducation(userId);
  }

  async addEducation(userId: string, data: any) {
    return profileRepo.addEducation(userId, data);
  }

  async updateEducation(eduId: string, userId: string, data: any) {
    return profileRepo.updateEducation(eduId, userId, data);
  }

  async deleteEducation(eduId: string, userId: string) {
    return profileRepo.deleteEducation(eduId, userId);
  }

  // ----- Habits -----
  async getHabits(userId: string) {
    return profileRepo.getHabits(userId);
  }

  async setHabits(userId: string, habitIds: string[]) {
    return profileRepo.setHabits(userId, habitIds);
  }

  // ----- Looking-For Habits -----
  async getLookingForHabits(userId: string) {
    return profileRepo.getLookingForHabits(userId);
  }

  async setLookingForHabits(userId: string, habitIds: string[]) {
    return profileRepo.setLookingForHabits(userId, habitIds);
  }
}
