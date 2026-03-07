import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const data = await authService.signup(req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = await authService.login(req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }
}
