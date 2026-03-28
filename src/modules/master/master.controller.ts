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

  async createDegree(req: Request, res: Response) {
    try {
      const { full_name, common_name, other_names } = req.body;
      const submitted_by = (req as any).user?.id;
      const data = await masterService.createDegree({
        full_name,
        common_name,
        other_names: Array.isArray(other_names) ? other_names : (other_names ? other_names.split(',').map((s: string) => s.trim()) : []),
        submitted_by,
      });
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createPosition(req: Request, res: Response) {
    try {
      const { full_name, common_name, other_names } = req.body;
      const submitted_by = (req as any).user?.id;
      const data = await masterService.createPosition({
        full_name,
        common_name,
        other_names: Array.isArray(other_names) ? other_names : (other_names ? other_names.split(',').map((s: string) => s.trim()) : []),
        submitted_by,
      });
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createCompany(req: Request, res: Response) {
    try {
      const { name, logo_url, aliases } = req.body;
      const submitted_by = (req as any).user?.id;
      const data = await masterService.createCompany({
        name,
        logo_url,
        aliases: Array.isArray(aliases) ? aliases : (aliases ? aliases.split(',').map((s: string) => s.trim()) : []),
        submitted_by,
      });
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createInstitution(req: Request, res: Response) {
    try {
      const { name, logo_url, aliases } = req.body;
      const submitted_by = (req as any).user?.id;
      const data = await masterService.createInstitution({
        name,
        logo_url,
        aliases: Array.isArray(aliases) ? aliases : (aliases ? aliases.split(',').map((s: string) => s.trim()) : []),
        submitted_by,
      });
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
