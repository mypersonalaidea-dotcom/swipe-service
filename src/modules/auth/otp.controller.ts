import { Request, Response } from 'express';
import { OtpService } from './otp.service';
import { AuthRepository } from './auth.repository';
import { generateToken } from '../../utils/jwt';

const otpService = new OtpService();
const authRepo = new AuthRepository();

export class OtpController {
  async verify(req: Request, res: Response) {
    try {
      const { phone, otp } = req.body;
      const result = await otpService.verifyOtp(phone, otp);

      // If phone belongs to a user, issue auth token to sign in/register flow
      const user = await authRepo.findUserByPhone(phone);
      if (user) {
        const token = generateToken({ id: user.id });
        const { password_hash: _, ...userWithoutPassword } = user as any;
        return res.status(200).json({ success: true, token, user: userWithoutPassword });
      }

      // If no user, simply confirm phone verified
      return res.status(200).json({ success: true });
    } catch (error: any) {
      if (error.code === 'INVALID' || error.code === 'EXPIRED') return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      if (error.code === 'BAD_REQUEST') return res.status(400).json({ success: false, message: error.message });
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
