import { Request, Response } from 'express';
import { DiscoverService } from './discover.service';

const discoverService = new DiscoverService();

const getUserId = (req: Request): string | null => (req as any).user?.id ?? null;

export class DiscoverController {
  /**
   * GET /api/v1/discover/feed?page=1&limit=3
   * Returns paginated profile cards for the homepage.
   */
  async getFeed(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;

      const data = await discoverService.getFeed(userId, page, limit);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/v1/discover/visited
   * Mark profiles as visited so they won't appear in the feed again.
   * Body: { profile_ids: ["uuid1", "uuid2", ...] }
   */
  async markVisited(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { profile_ids } = req.body;
      if (!Array.isArray(profile_ids) || profile_ids.length === 0) {
        return res.status(400).json({ success: false, message: 'profile_ids must be a non-empty array of UUIDs' });
      }

      const data = await discoverService.markVisited(userId, profile_ids);
      res.status(200).json({ success: true, data, message: 'Profiles marked as visited' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * DELETE /api/v1/discover/visited
   * Clear all visited profiles — the user will see all profiles again.
   */
  async clearVisited(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const data = await discoverService.clearVisited(userId);
      res.status(200).json({ success: true, data, message: 'Visited history cleared' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
