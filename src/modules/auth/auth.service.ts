import { AuthRepository } from './auth.repository';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';

const authRepo = new AuthRepository();

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
      password_hash
    });

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
    return { exists: !!existingUser };
  }
}
