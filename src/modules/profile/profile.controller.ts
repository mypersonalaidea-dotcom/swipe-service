import { Request, Response } from 'express';
import { ProfileService } from './profile.service';

const profileService = new ProfileService();

const getUserId = (req: Request): string | null => (req as any).user?.id ?? null;

export class ProfileController {
  // ====== Profile CRUD ======
  async getMyProfile(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.getProfile(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getProfileById(req: Request, res: Response) {
    try {
      const data = await profileService.getProfile(req.params.id as string);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateMyProfile(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ====== Jobs ======
  async getJobs(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.getJobs(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addJob(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.addJob(userId, req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.updateJob(req.params.jobId as string, userId, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteJob(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      await profileService.deleteJob(req.params.jobId as string, userId);
      res.status(200).json({ success: true, message: 'Job deleted' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ====== Education ======
  async getEducation(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.getEducation(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addEducation(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.addEducation(userId, req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateEducation(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.updateEducation(req.params.eduId as string, userId, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteEducation(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      await profileService.deleteEducation(req.params.eduId as string, userId);
      res.status(200).json({ success: true, message: 'Education deleted' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ====== Habits ======
  async getHabits(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.getHabits(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async setHabits(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { habit_ids } = req.body;
      if (!Array.isArray(habit_ids)) return res.status(400).json({ success: false, message: 'habit_ids must be an array' });
      const data = await profileService.setHabits(userId, habit_ids);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ====== Looking-For Habits ======
  async getLookingForHabits(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.getLookingForHabits(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async setLookingForHabits(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const { habit_ids } = req.body;
      if (!Array.isArray(habit_ids)) return res.status(400).json({ success: false, message: 'habit_ids must be an array' });
      const data = await profileService.setLookingForHabits(userId, habit_ids);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ====== Search Preferences ======
  async getSearchPreferences(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.getSearchPreferences(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateSearchPreferences(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const data = await profileService.updateSearchPreferences(userId, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
