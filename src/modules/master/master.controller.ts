import { Request, Response } from 'express';
import { MasterService } from './master.service';

const masterService = new MasterService();

export class MasterController {
  async getDegrees(req: Request, res: Response) {
    try {
      const data = await masterService.getDegrees();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPositions(req: Request, res: Response) {
    try {
      const data = await masterService.getPositions();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCompanies(req: Request, res: Response) {
    try {
      const data = await masterService.getCompanies();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getInstitutions(req: Request, res: Response) {
    try {
      const data = await masterService.getInstitutions();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getHabits(req: Request, res: Response) {
    try {
      const data = await masterService.getHabits();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAmenities(req: Request, res: Response) {
    try {
      const data = await masterService.getAmenities();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
