import bcrypt from 'bcryptjs';
import { EmailOtpRepository } from './email-otp.repository';
import { EmailService } from '../../utils/email.service';

const emailOtpRepo = new EmailOtpRepository();
const emailService = new EmailService();

function generateNumericOtp(length = 6) {
  const max = 10 ** length;
  const num = Math.floor(Math.random() * max);
  return num.toString().padStart(length, '0');
}

export class EmailOtpService {
  private OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes (longer than phone OTP since email can be slower)
  private MAX_PER_HOUR = 5;

  async requestOtp(email: string) {
    if (!email) throw new Error('Email is required');

    // rate limit check
    const recentCount = await emailOtpRepo.countRequestsInLastHour(email);
    if (recentCount >= this.MAX_PER_HOUR) {
      const err: any = new Error('Too many OTP requests, try again later');
      err.code = 'RATE_LIMIT';
      throw err;
    }

    const otp = generateNumericOtp(6);
    const hash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + this.OTP_TTL_MS);

    // use repository transactional helper
    const created = await emailOtpRepo.createOtpTransactional(email, hash, expiresAt);

    // Send OTP via email using Resend
    try {
      await emailService.sendOtp(email, otp);
      console.log(`[EMAIL-OTP] Email sent successfully to ${email}`);
    } catch (emailError: any) {
      console.error(`[EMAIL-OTP] Email send failed for ${email}: ${emailError.message}`);
      // Don't fail the OTP request if email delivery fails — the OTP is stored in DB
    }

    // In dev, return OTP for testing convenience
    const devReturn = process.env.OTP_DEV_RETURN === 'true' || process.env.NODE_ENV === 'test';
    return { id: created.id, email: created.email, expires_at: created.expires_at, otp: devReturn ? otp : undefined };
  }

  async verifyOtp(email: string, otp: string) {
    if (!email || !otp) {
      const err: any = new Error('Email and OTP are required');
      err.code = 'BAD_REQUEST';
      throw err;
    }

    const record = await emailOtpRepo.getLatestUnconsumed(email);
    if (!record) {
      const err: any = new Error('Invalid or expired OTP');
      err.code = 'INVALID';
      throw err;
    }

    if (record.expires_at.getTime() < Date.now()) {
      // expire it
      await emailOtpRepo.invalidateById(record.id);
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
    await emailOtpRepo.invalidateById(record.id);
    return { success: true };
  }
}
