import { prisma } from '../../config/database';

export class OtpRepository {
  async createOtp(data: { phone: string; otp_hash: string; expires_at: Date }) {
    // cast prisma to any for dynamic model access to avoid generated client typing issues
    return (prisma as any).phoneOtp.create({ data: { phone: data.phone, otp_hash: data.otp_hash, expires_at: data.expires_at } });
  }

  async markAllConsumed(phone: string) {
    return (prisma as any).phoneOtp.updateMany({ where: { phone, consumed: false }, data: { consumed: true } });
  }

  async getLatestUnconsumed(phone: string) {
    return (prisma as any).phoneOtp.findFirst({ where: { phone, consumed: false }, orderBy: { created_at: 'desc' } });
  }

  async countRequestsInLastHour(phone: string) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return (prisma as any).phoneOtp.count({ where: { phone, created_at: { gte: oneHourAgo } } });
  }

  async invalidateById(id: string) {
    return (prisma as any).phoneOtp.update({ where: { id }, data: { consumed: true } });
  }
}
