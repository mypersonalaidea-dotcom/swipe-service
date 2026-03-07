import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (payload: object, expiresIn: string | number = '1d') => {
  return jwt.sign(payload, env.JWT_SECRET as string, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};
