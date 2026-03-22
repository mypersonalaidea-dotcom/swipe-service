import { prisma } from '../../config/database';

export class EmailOtpRepository {
  // Create OTP using client model if available, otherwise fallback to raw SQL
  async createOtp(data: { email: string; otp_hash: string; expires_at: Date }) {
    const clientModel = (prisma as any).emailOtp;
    if (clientModel) {
      return clientModel.create({ data: { email: data.email, otp_hash: data.otp_hash, expires_at: data.expires_at } });
    }

    // raw SQL fallback
    const rec = (await prisma.$queryRawUnsafe(
      `INSERT INTO email_otps (email, otp_hash, expires_at) VALUES ($1, $2, $3) RETURNING *`,
      data.email,
      data.otp_hash,
      data.expires_at
    )) as any[];
    return rec && rec[0] ? rec[0] : rec;
  }

  async markAllConsumed(email: string) {
    const clientModel = (prisma as any).emailOtp;
    if (clientModel) {
      return clientModel.updateMany({ where: { email, consumed: false }, data: { consumed: true } });
    }

    return prisma.$executeRawUnsafe(`UPDATE email_otps SET consumed = true WHERE email = $1 AND consumed = false`, email);
  }

  async getLatestUnconsumed(email: string) {
    const clientModel = (prisma as any).emailOtp;
    if (clientModel) {
      return clientModel.findFirst({ where: { email, consumed: false }, orderBy: { created_at: 'desc' } });
    }

    const rec = (await prisma.$queryRawUnsafe(`SELECT * FROM email_otps WHERE email = $1 AND consumed = false ORDER BY created_at DESC LIMIT 1`, email)) as any[];
    return rec && rec[0] ? rec[0] : null;
  }

  async countRequestsInLastHour(email: string) {
    const clientModel = (prisma as any).emailOtp;
    if (clientModel) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return clientModel.count({ where: { email, created_at: { gte: oneHourAgo } } });
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const rows: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM email_otps WHERE email = $1 AND created_at >= $2`, email, oneHourAgo);
    if (rows && rows[0] && typeof rows[0].cnt !== 'undefined') return Number(rows[0].cnt);
    return 0;
  }

  async invalidateById(id: string) {
    const clientModel = (prisma as any).emailOtp;
    if (clientModel) {
      return clientModel.update({ where: { id }, data: { consumed: true } });
    }

    return prisma.$executeRawUnsafe(`UPDATE email_otps SET consumed = true WHERE id = $1`, id);
  }

  // Atomic operation: mark existing as consumed and create new OTP in a transaction
  async createOtpTransactional(email: string, otp_hash: string, expires_at: Date) {
    const clientModel = (prisma as any).emailOtp;
    if (clientModel) {
      return prisma.$transaction(async (tx: any) => {
        await tx.emailOtp.updateMany({ where: { email, consumed: false }, data: { consumed: true } });
        return tx.emailOtp.create({ data: { email, otp_hash, expires_at } });
      });
    }

    return prisma.$transaction(async (tx: any) => {
      await tx.$executeRawUnsafe(`UPDATE email_otps SET consumed = true WHERE email = $1 AND consumed = false`, email);
      const rec = (await tx.$queryRawUnsafe(`INSERT INTO email_otps (email, otp_hash, expires_at) VALUES ($1, $2, $3) RETURNING *`, email, otp_hash, expires_at)) as any[];
      return rec && rec[0] ? rec[0] : rec;
    });
  }
}
