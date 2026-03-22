import bcrypt from 'bcryptjs';
import { OtpRepository } from './otp.repository';
import { prisma } from '../../config/database';
import { SmsService } from '../../utils/sms.service';

const otpRepo = new OtpRepository();
const smsService = new SmsService();

function generateNumericOtp(length = 6) {
  const max = 10 ** length;
  const num = Math.floor(Math.random() * max);
  return num.toString().padStart(length, '0');
}

export class OtpService {
  private OTP_TTL_MS = 60 * 1000; // 1 minute
  private MAX_PER_HOUR = 5;

  async requestOtp(phone: string) {
    if (!phone) throw new Error('Phone is required');

    // rate limit check
    const recentCount = await otpRepo.countRequestsInLastHour(phone);
    if (recentCount >= this.MAX_PER_HOUR) {
      const err: any = new Error('Too many OTP requests, try again later');
      err.code = 'RATE_LIMIT';
      throw err;
    }

    const otp = generateNumericOtp(6);
    const hash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + this.OTP_TTL_MS);

    // use repository transactional helper
    const created = await otpRepo.createOtpTransactional(phone, hash, expiresAt);

    // Send OTP via SMS using 2Factor.in
    try {
      await smsService.sendOtp(phone, otp);
      console.log(`[OTP] SMS sent successfully to ${phone}`);
    } catch (smsError: any) {
      console.error(`[OTP] SMS send failed for ${phone}: ${smsError.message}`);
      // Don't fail the OTP request if SMS delivery fails — the OTP is stored in DB
      // and can potentially be resent. Log the error for monitoring.
    }

    // In dev, return OTP for testing convenience
    const devReturn = process.env.OTP_DEV_RETURN === 'true' || process.env.NODE_ENV === 'test';
    return { id: created.id, phone: created.phone, expires_at: created.expires_at, otp: devReturn ? otp : undefined };
  }

  async verifyOtp(phone: string, otp: string) {
    if (!phone || !otp) {
      const err: any = new Error('Phone and OTP are required');
      err.code = 'BAD_REQUEST';
      throw err;
    }

    const record = await otpRepo.getLatestUnconsumed(phone);
    if (!record) {
      const err: any = new Error('Invalid or expired OTP');
      err.code = 'INVALID';
      throw err;
    }

    if (record.expires_at.getTime() < Date.now()) {
      // expire it
      await otpRepo.invalidateById(record.id);
      const err: any = new Error('Invalid or expired OTP');
      err.code = 'EXPIRED';
      throw err;
    }

    const match = await bcrypt.compare(otp, record.otp_hash);
    if (!match) {
      const err: any = new Error('Invalid or expired OTP');
      err.code = 'INVALID';
      throw err;
    }

    // consume
    await otpRepo.invalidateById(record.id);
    return { success: true };
  }
}
