import { SearchPreferenceRepository } from './search-preference.repository';

const repo = new SearchPreferenceRepository();

// Whitelist for the main search preference fields
const ALLOWED_FIELDS = [
  'flat_filter_enabled',
  'location_search',
  'location_range_km',
  'price_min',
  'price_max',
  'flat_types',
  'furnishing_types',
  'room_types',
  'available_from',
  'brokerage_pref',
  'security_deposit_max',
  'flatmate_filter_enabled',
  'flatmate_age_min',
  'flatmate_age_max',
  'flatmate_move_in_date',
  'profile_filter_enabled',
] as const;

function pickAllowed(obj: any): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of ALLOWED_FIELDS) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  // Coerce numeric fields
  if (result.location_range_km !== undefined) result.location_range_km = Number(result.location_range_km);
  if (result.price_min !== undefined) result.price_min = Number(result.price_min);
  if (result.price_max !== undefined) result.price_max = Number(result.price_max);
  if (result.security_deposit_max !== undefined) result.security_deposit_max = Number(result.security_deposit_max);
  if (result.flatmate_age_min !== undefined) result.flatmate_age_min = Number(result.flatmate_age_min);
  if (result.flatmate_age_max !== undefined) result.flatmate_age_max = Number(result.flatmate_age_max);
  // Coerce date fields
  if (result.available_from !== undefined && result.available_from) {
    result.available_from = new Date(result.available_from);
  }
  if (result.flatmate_move_in_date !== undefined && result.flatmate_move_in_date) {
    result.flatmate_move_in_date = new Date(result.flatmate_move_in_date);
  }
  return result;
}

export class SearchPreferenceService {
  // ─── Main preference ──────────────────────────────────────────────────────
  async getSearchPreference(userId: string) {
    const pref = await repo.findByUserId(userId);
    const filterHabits = await repo.getFilterHabits(userId);
    const filterAmenities = await repo.getFilterAmenities(userId);
    const filterCompanies = await repo.getFilterCompanies(userId);
    const filterInstitutions = await repo.getFilterInstitutions(userId);
    return {
      preference: pref,
      filter_habits: filterHabits,
      filter_amenities: filterAmenities,
      filter_companies: filterCompanies,
      filter_institutions: filterInstitutions,
    };
  }

  async upsertSearchPreference(userId: string, data: any) {
    const safeData = pickAllowed(data);
    return repo.upsert(userId, safeData);
  }

  async deleteSearchPreference(userId: string) {
    return repo.delete(userId);
  }

  // ─── Filter Habits ────────────────────────────────────────────────────────
  async getFilterHabits(userId: string) {
    return repo.getFilterHabits(userId);
  }

  async setFilterHabits(userId: string, habits: { habit_id: string; filter_context: string }[]) {
    return repo.setFilterHabits(userId, habits);
  }

  // ─── Filter Amenities ─────────────────────────────────────────────────────
  async getFilterAmenities(userId: string) {
    return repo.getFilterAmenities(userId);
  }

  async setFilterAmenities(userId: string, amenities: { amenity_id: string; amenity_context: string }[]) {
    return repo.setFilterAmenities(userId, amenities);
  }

  // ─── Filter Companies ─────────────────────────────────────────────────────
  async getFilterCompanies(userId: string) {
    return repo.getFilterCompanies(userId);
  }

  async setFilterCompanies(userId: string, companyIds: string[]) {
    return repo.setFilterCompanies(userId, companyIds);
  }

  // ─── Filter Institutions ──────────────────────────────────────────────────
  async getFilterInstitutions(userId: string) {
    return repo.getFilterInstitutions(userId);
  }

  async setFilterInstitutions(userId: string, institutionIds: string[]) {
    return repo.setFilterInstitutions(userId, institutionIds);
  }
}
