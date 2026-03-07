import { Request, Response } from 'express';
import { ProfileService } from './profile.service';

const profileService = new ProfileService();

export class ProfileController {
  async getMyProfile(req: Request, res: Response) {
    try {
      const authReq = req as any; 
      const userId = authReq.user?.id;
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
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateMyProfile(req: Request, res: Response) {
    try {
      const authReq = req as any; 
      const userId = authReq.user?.id;
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const data = await profileService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
