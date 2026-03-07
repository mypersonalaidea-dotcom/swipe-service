import { AuthRepository } from './auth.repository';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';

const authRepo = new AuthRepository();

export class AuthService {
  async signup(data: any) {
    if (!data.email || !data.password || !data.name) {
      throw new Error('Name, Email, and Password are required');
    }

    const existingUser = await authRepo.findUserByEmail(data.email);
    if (existingUser) throw new Error('Email already registered');

    const password_hash = await bcrypt.hash(data.password, 10);
    const user = await authRepo.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password_hash
    });

    const token = generateToken({ id: user.id });
    const { password_hash: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, token };
  }

  async login(data: any) {
    if (!data.email || !data.password) {
      throw new Error('Email and Password are required');
    }

    const user = await authRepo.findUserByEmail(data.email);
    console.log('[AUTH] Login attempt for:', data.email);
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
}
