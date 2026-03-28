import { AuthRepository } from './auth.repository';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';
import { OtpService } from './otp.service';
import { EmailOtpService } from './email-otp.service';

import { FlatsService } from '../flats/flats.service';

const authRepo = new AuthRepository();
const otpService = new OtpService();
const emailOtpService = new EmailOtpService();
const flatsService = new FlatsService();

export class AuthService {
  async signup(data: any) {
    if (!data.name || !data.age || !data.gender || !data.phone || !data.password) {
      throw new Error('Name, Age, Gender, Phone, and Password are required');
    }

    const existingPhone = await authRepo.findUserByPhone(data.phone);
    if (existingPhone) throw new Error('Phone number already registered');

    if (data.email) {
      const existingEmail = await authRepo.findUserByEmail(data.email);
      if (existingEmail) throw new Error('Email already registered');
    }

    const password_hash = await bcrypt.hash(data.password, 10);
    const user = await authRepo.createUser({
      name: data.name,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      ...(data.email && { email: data.email }),
      ...(data.profile_picture_url && { profile_picture_url: data.profile_picture_url }),
      ...(data.city && { city: data.city }),
      ...(data.state && { state: data.state }),
      ...(data.search_type && { search_type: data.search_type }),
      ...(data.phone_verified !== undefined && { phone_verified: data.phone_verified }),
      ...(data.email_verified !== undefined && { email_verified: data.email_verified }),
      password_hash
    });

    // If flat details are provided during signup (onboarding flow), create the flat.
    if (data.flat_details) {
      try {
        await flatsService.createFlat({
          ...data.flat_details,
          user_id: user.id
        });
      } catch (err) {
        console.error('[AUTH] Failed to create flat during signup:', err);
        // We don't fail the whole signup if flat creation fails, but maybe we should?
        // For now, just log it.
      }
    }

    const token = generateToken({ id: user.id });
    const { password_hash: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, token };
  }

  async login(data: any) {
    if (!data.password) {
      throw new Error('Password is required');
    }
    if (!data.phone && !data.email) {
      throw new Error('Phone number or Email is required');
    }

    let user: any = null;

    if (data.phone) {
      console.log('[AUTH] Login attempt for phone:', data.phone);
      user = await authRepo.findUserByPhone(data.phone);
    } else {
      console.log('[AUTH] Login attempt for email:', data.email);
      user = await authRepo.findUserByEmail(data.email);
    }

    console.log('[AUTH] User found:', !!user);

    if (!user) throw new Error('Invalid credentials');

    console.log('[AUTH] Stored hash:', user.password_hash);
    const isValid = await bcrypt.compare(data.password, user.password_hash);
    console.log('[AUTH] Password match:', isValid);

    if (!isValid) throw new Error('Invalid credentials');

    const token = generateToken({ id: user.id });
    const { password_hash: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, token };
  }

  async checkPhone(phone: string) {
    if (!phone) {
      throw new Error('Phone number is required');
    }
    const existingUser = await authRepo.findUserByPhone(phone);
    // Always attempt to create an OTP session regardless of whether user exists or not
    // This avoids account enumeration and starts the verification flow
    try {
      const otpResult = await otpService.requestOtp(phone);
      return { exists: !!existingUser, otp_sent: true, otp_id: otpResult.id, otp: otpResult.otp };
    } catch (err: any) {
      if (err.code === 'RATE_LIMIT') throw new Error('Too many OTP requests, try again later');
      throw err;
    }
  }

  async checkEmail(email: string) {
    if (!email) {
      throw new Error('Email is required');
    }
    const existingUser = await authRepo.findUserByEmail(email);
    // Always attempt to create an OTP session regardless of whether user exists or not
    // This avoids account enumeration and starts the verification flow
    try {
      const otpResult = await emailOtpService.requestOtp(email);
      return { exists: !!existingUser, otp_sent: true, otp_id: otpResult.id, otp: otpResult.otp };
    } catch (err: any) {
      if (err.code === 'RATE_LIMIT') throw new Error('Too many OTP requests, try again later');
      throw err;
    }
  }
}
