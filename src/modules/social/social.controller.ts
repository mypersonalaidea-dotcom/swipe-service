import { Request, Response } from 'express';
import { SocialService } from './social.service';

const socialService = new SocialService();

export class SocialController {
  async toggleSaveProfile(req: any, res: Response) {
    try {
      const { targetUserId } = req.body;
      const userId = req.user.id;

      if (!targetUserId) {
        return res.status(400).json({ success: false, message: 'targetUserId is required' });
      }

      const result = await socialService.toggleSaveProfile(userId, targetUserId);
      return res.json({ success: true, ...result });
    } catch (error: any) {
      return res.status(error.message.includes('not found') ? 404 : 400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSavedProfiles(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const data = await socialService.getSavedProfiles(userId);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
