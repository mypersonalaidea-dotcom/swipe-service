import { prisma } from '../../config/database';

export class OtpRepository {
  // Create OTP using client model if available, otherwise fallback to raw SQL
  async createOtp(data: { phone: string; otp_hash: string; expires_at: Date }) {
    const clientModel = (prisma as any).phoneOtp;
    if (clientModel) {
      return clientModel.create({ data: { phone: data.phone, otp_hash: data.otp_hash, expires_at: data.expires_at } });
    }

    // raw SQL fallback
    const rec = (await prisma.$queryRawUnsafe(
      `INSERT INTO phone_otps (phone, otp_hash, expires_at) VALUES ($1, $2, $3) RETURNING *`,
      data.phone,
      data.otp_hash,
      data.expires_at
    )) as any[];
    return rec && rec[0] ? rec[0] : rec;
  }

  async markAllConsumed(phone: string) {
    const clientModel = (prisma as any).phoneOtp;
    if (clientModel) {
      return clientModel.updateMany({ where: { phone, consumed: false }, data: { consumed: true } });
    }

    return prisma.$executeRawUnsafe(`UPDATE phone_otps SET consumed = true WHERE phone = $1 AND consumed = false`, phone);
  }

  async getLatestUnconsumed(phone: string) {
    const clientModel = (prisma as any).phoneOtp;
    if (clientModel) {
      return clientModel.findFirst({ where: { phone, consumed: false }, orderBy: { created_at: 'desc' } });
    }

    const rec = (await prisma.$queryRawUnsafe(`SELECT * FROM phone_otps WHERE phone = $1 AND consumed = false ORDER BY created_at DESC LIMIT 1`, phone)) as any[];
    return rec && rec[0] ? rec[0] : null;
  }

  async countRequestsInLastHour(phone: string) {
    const clientModel = (prisma as any).phoneOtp;
    if (clientModel) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return clientModel.count({ where: { phone, created_at: { gte: oneHourAgo } } });
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const rows: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM phone_otps WHERE phone = $1 AND created_at >= $2`, phone, oneHourAgo);
    if (rows && rows[0] && typeof rows[0].cnt !== 'undefined') return Number(rows[0].cnt);
    // fallback: 0
    return 0;
  }

  async invalidateById(id: string) {
    const clientModel = (prisma as any).phoneOtp;
    if (clientModel) {
      return clientModel.update({ where: { id }, data: { consumed: true } });
    }

    return prisma.$executeRawUnsafe(`UPDATE phone_otps SET consumed = true WHERE id = $1`, id);
  }

  // Atomic operation: mark existing as consumed and create new OTP in a transaction
  async createOtpTransactional(phone: string, otp_hash: string, expires_at: Date) {
    const clientModel = (prisma as any).phoneOtp;
    if (clientModel) {
      return prisma.$transaction(async (tx: any) => {
        await tx.phoneOtp.updateMany({ where: { phone, consumed: false }, data: { consumed: true } });
        return tx.phoneOtp.create({ data: { phone, otp_hash, expires_at } });
      });
    }

    return prisma.$transaction(async (tx: any) => {
      await tx.$executeRawUnsafe(`UPDATE phone_otps SET consumed = true WHERE phone = $1 AND consumed = false`, phone);
      const rec = (await tx.$queryRawUnsafe(`INSERT INTO phone_otps (phone, otp_hash, expires_at) VALUES ($1, $2, $3) RETURNING *`, phone, otp_hash, expires_at)) as any[];
      return rec && rec[0] ? rec[0] : rec;
    });
  }
}
