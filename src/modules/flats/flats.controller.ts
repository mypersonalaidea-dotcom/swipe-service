import { Request, Response } from 'express';
import { FlatsService } from './flats.service';

const flatsService = new FlatsService();

export class FlatsController {
  async getFlats(req: Request, res: Response) {
    try {
      const data = await flatsService.getFlats();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getFlatById(req: Request, res: Response) {
    try {
      const data = await flatsService.getFlatById(req.params.id as string);
      if (!data) return res.status(404).json({ success: false, message: 'Flat not found' });
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createFlat(req: Request, res: Response) {
    try {
      const authReq = req as any; // using any for custom auth property
      const userId = authReq.user?.id;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      
      const data = await flatsService.createFlat({
         ...req.body,
         user_id: userId
      });
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
