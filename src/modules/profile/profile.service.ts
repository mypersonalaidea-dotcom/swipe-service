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
    // Only allow updating safe fields
    const safeData = {
      name: data.name,
      age: data.age,
      gender: data.gender,
      city: data.city,
      state: data.state,
      search_type: data.search_type,
      is_published: data.is_published
    };
    
    // clean undefined
    Object.keys(safeData).forEach(key => (safeData as any)[key] === undefined && delete (safeData as any)[key]);

    const updated = await profileRepo.updateProfile(id, safeData);
    const { password_hash: _, ...safeProfile } = updated as any;
    return safeProfile;
  }
}
