import { ProfileRepository } from './profile.repository';
import { FlatFormatter } from '../../utils/flat-formatter';
import { UserFormatter } from '../../utils/user-formatter';

const profileRepo = new ProfileRepository();

// ─── Field whitelists ─────────────────────────────────────────────────────────
// Only the fields listed here can ever reach the database.
// Any extra client-supplied keys are silently dropped.
const JOB_FIELDS = [
  'company_id', 'position_id',
  'company_name', 'position_name',
  'from_year', 'till_year',
  'currently_working', 'display_order',
] as const;

const EDUCATION_FIELDS = [
  'institution_id', 'degree_id',
  'institution_name', 'degree_name',
  'start_year', 'end_year',
  'display_order',
] as const;

function pick<T extends string>(obj: any, keys: readonly T[]): Partial<Record<T, any>> {
  const result: Partial<Record<T, any>> = {};
  for (const key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}

export class ProfileService {
  async getProfile(id: string) {
    const profile = await profileRepo.findById(id);
    if (!profile) throw new Error('Profile not found');
    let { password_hash: _, ...safeProfile } = profile as any;
    
    // Format flats if present
    if (safeProfile.flats && Array.isArray(safeProfile.flats)) {
      safeProfile.flats = safeProfile.flats.map((f: any) => FlatFormatter.formatFlat(f));
    }
    
    // Format the profile (user) itself
    safeProfile = UserFormatter.formatUser(safeProfile);
    
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
      is_published: data.is_published,
      profile_picture_url: data.profile_picture_url,
      email: data.email,
    };
    Object.keys(safeData).forEach(key => safeData[key] === undefined && delete safeData[key]);
    const updated = await profileRepo.updateProfile(id, safeData);
    let { password_hash: _, ...safeProfile } = updated as any;

    // Format flats if present
    if (safeProfile.flats && Array.isArray(safeProfile.flats)) {
      safeProfile.flats = safeProfile.flats.map((f: any) => FlatFormatter.formatFlat(f));
    }

    // Format the profile (user) itself
    safeProfile = UserFormatter.formatUser(safeProfile);

    return safeProfile;
  }

  // ----- Jobs -----
  async getJobs(userId: string) {
    return profileRepo.getJobs(userId);
  }

  async addJob(userId: string, data: any) {
    return profileRepo.addJob(userId, pick(data, JOB_FIELDS));
  }

  async updateJob(jobId: string, userId: string, data: any) {
    return profileRepo.updateJob(jobId, userId, pick(data, JOB_FIELDS));
  }

  async deleteJob(jobId: string, userId: string) {
    return profileRepo.deleteJob(jobId, userId);
  }

  // ----- Education -----
  async getEducation(userId: string) {
    return profileRepo.getEducation(userId);
  }

  async addEducation(userId: string, data: any) {
    return profileRepo.addEducation(userId, pick(data, EDUCATION_FIELDS));
  }

  async updateEducation(eduId: string, userId: string, data: any) {
    return profileRepo.updateEducation(eduId, userId, pick(data, EDUCATION_FIELDS));
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

  // ----- Search Preferences -----
  async getSearchPreferences(userId: string) {
    return profileRepo.getSearchPreferences(userId);
  }

  async updateSearchPreferences(userId: string, data: any) {
    const ARRAY_FIELDS = [
      'flat_types', 'furnishing_types', 'room_types',
      'room_amenities', 'common_amenities', 'companies', 'schools', 'habits'
    ] as const;

    const NUMERIC_FIELDS = [
      'latitude', 'longitude', 'radius_km', 'min_rent', 'max_rent', 'age_min', 'age_max'
    ] as const;

    const DATE_FIELDS = ['available_from', 'flatmate_move_in_date'] as const;

    const STRING_FIELDS = ['location_search', 'brokerage', 'security_deposit'] as const;

    const BOOLEAN_FIELDS = ['flat_filter_enabled', 'flatmate_filter_enabled', 'profile_filter_enabled'] as const;

    const safeData: Record<string, any> = {};

    // Helper: split "a,b,c" -> ["a", "b", "c"]
    const toArray = (v: any) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    };

    ARRAY_FIELDS.forEach(f => { if (data[f] !== undefined) safeData[f] = toArray(data[f]); });
    NUMERIC_FIELDS.forEach(f => { if (data[f] !== undefined) safeData[f] = data[f] === null ? null : Number(data[f]); });
    DATE_FIELDS.forEach(f => { if (data[f] !== undefined) safeData[f] = data[f] ? new Date(data[f]) : null; });
    STRING_FIELDS.forEach(f => { if (data[f] !== undefined) safeData[f] = data[f]; });
    BOOLEAN_FIELDS.forEach(f => { if (data[f] !== undefined) safeData[f] = !!data[f]; });

    return profileRepo.upsertSearchPreferences(userId, safeData);
  }
}
