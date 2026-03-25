import { Request, Response } from 'express';
import { SearchPreferenceService } from './search-preference.service';

const service = new SearchPreferenceService();

const getUserId = (req: Request): string | null => (req as any).user?.id ?? null;

export class SearchPreferenceController {
  // ─── Main preference ──────────────────────────────────────────────────────
  async get(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await service.getSearchPreference(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async upsert(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await service.upsertSearchPreference(userId, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      await service.deleteSearchPreference(userId);
      res.status(200).json({ success: true, message: 'Search preference deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ─── Filter Habits ────────────────────────────────────────────────────────
  async getFilterHabits(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await service.getFilterHabits(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async setFilterHabits(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { habits } = req.body; // [{ habit_id, filter_context }]
      if (!Array.isArray(habits)) return res.status(400).json({ success: false, message: 'habits must be an array of { habit_id, filter_context }' });
      const data = await service.setFilterHabits(userId, habits);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─── Filter Amenities ─────────────────────────────────────────────────────
  async getFilterAmenities(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await service.getFilterAmenities(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async setFilterAmenities(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { amenities } = req.body; // [{ amenity_id, amenity_context }]
      if (!Array.isArray(amenities)) return res.status(400).json({ success: false, message: 'amenities must be an array of { amenity_id, amenity_context }' });
      const data = await service.setFilterAmenities(userId, amenities);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─── Filter Companies ─────────────────────────────────────────────────────
  async getFilterCompanies(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await service.getFilterCompanies(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async setFilterCompanies(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { company_ids } = req.body;
      if (!Array.isArray(company_ids)) return res.status(400).json({ success: false, message: 'company_ids must be an array' });
      const data = await service.setFilterCompanies(userId, company_ids);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ─── Filter Institutions ──────────────────────────────────────────────────
  async getFilterInstitutions(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await service.getFilterInstitutions(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async setFilterInstitutions(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { institution_ids } = req.body;
      if (!Array.isArray(institution_ids)) return res.status(400).json({ success: false, message: 'institution_ids must be an array' });
      const data = await service.setFilterInstitutions(userId, institution_ids);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
