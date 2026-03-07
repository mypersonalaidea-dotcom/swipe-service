import { prisma } from '../../config/database';

export class FlatsRepository {
  async getFlats() {
    return prisma.flat.findMany({
      where: { status: 'active', is_published: true },
      include: {
        rooms: { include: { room_amenities: { include: { amenity: true } }, media: true } },
        common_amenities: { include: { amenity: true } },
        media: true,
        user: { select: { id: true, name: true, profile_picture_url: true } }
      }
    });
  }

  async getFlatById(id: string) {
    return prisma.flat.findUnique({
      where: { id },
      include: {
        rooms: { include: { room_amenities: { include: { amenity: true } }, media: true } },
        common_amenities: { include: { amenity: true } },
        media: true,
        user: { select: { id: true, name: true, profile_picture_url: true } }
      }
    });
  }

  async createFlat(data: any) {
    return prisma.flat.create({ data });
  }
}
