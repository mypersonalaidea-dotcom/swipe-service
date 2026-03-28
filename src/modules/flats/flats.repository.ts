import { prisma } from '../../config/database';

export class FlatsRepository {
  async getFlats() {
    return prisma.flat.findMany({
      where: { status: 'active', is_published: true },
      include: {
        rooms: { include: { room_amenities: { include: { amenity: true } }, media: true } },
        common_amenities: { include: { amenity: true } },
        media: true,
        user: { select: { id: true, name: true, age: true, profile_picture_url: true } }
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
        user: { select: { id: true, name: true, age: true, profile_picture_url: true } }
      }
    });
  }

  async createFlat(data: any) {
    return prisma.flat.create({ data });
  }

  /**
   * Create a flat with nested rooms, room amenities, and common amenities
   * in one transaction.
   */
  async createFlatWithRooms(
    flatData: any,
    rooms: Array<{
      room_name?: string;
      room_type: string;
      rent?: number;
      security_deposit?: number;
      brokerage?: number;
      available_count?: number;
      available_from?: string;
      display_order?: number;
      amenities?: string[]; // amenity names
      media?: any[]; // URLs
    }>,
    commonAmenities?: string[], // amenity names
    flatMedia?: any[], // URLs
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the flat
      const flat = await tx.flat.create({ data: flatData });

      if (flatMedia && flatMedia.length > 0) {
        await tx.flatMedia.createMany({
          data: flatMedia.map((m: any, i: number) => ({
            flat_id: flat.id,
            media_url: typeof m === 'string' ? m : m.url || m.media_url,
            display_order: i
          }))
        });
      }

      // 2. Create rooms with amenities
      for (const room of rooms) {
        const { amenities: amenityNames, media: roomMedia, ...roomFields } = room;

        // Coerce numeric fields
        const roomData: any = {
          flat_id: flat.id,
          room_name: roomFields.room_name || undefined,
          room_type: roomFields.room_type,
          display_order: roomFields.display_order ?? 0,
        };

        if (roomFields.rent !== undefined) roomData.rent = Number(roomFields.rent);
        if (roomFields.security_deposit !== undefined) roomData.security_deposit = Number(roomFields.security_deposit);
        if (roomFields.brokerage !== undefined) roomData.brokerage = Number(roomFields.brokerage);
        if (roomFields.available_count !== undefined) roomData.available_count = Number(roomFields.available_count);
        if (roomFields.available_from) roomData.available_from = new Date(roomFields.available_from);

        const createdRoom = await tx.room.create({ data: roomData });

        if (roomMedia && roomMedia.length > 0) {
          await tx.roomMedia.createMany({
            data: roomMedia.map((m: any, i: number) => ({
              room_id: createdRoom.id,
              media_url: typeof m === 'string' ? m : m.url || m.media_url,
              display_order: i
            }))
          });
        }

        // Link room amenities by name
        if (amenityNames && amenityNames.length > 0) {
          const masterAmenities = await tx.masterAmenity.findMany({
            where: { name: { in: amenityNames }, status: 'active' },
          });

          if (masterAmenities.length > 0) {
            await tx.roomAmenity.createMany({
              data: masterAmenities.map((a) => ({
                room_id: createdRoom.id,
                amenity_id: a.id,
              })),
              skipDuplicates: true,
            });
          }
        }
      }

      // 3. Link common amenities by name
      if (commonAmenities && commonAmenities.length > 0) {
        const masterAmenities = await tx.masterAmenity.findMany({
          where: { name: { in: commonAmenities }, status: 'active' },
        });

        if (masterAmenities.length > 0) {
          await tx.flatCommonAmenity.createMany({
            data: masterAmenities.map((a) => ({
              flat_id: flat.id,
              amenity_id: a.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      // Return the flat with all nested data
      return tx.flat.findUnique({
        where: { id: flat.id },
        include: {
          rooms: { include: { room_amenities: { include: { amenity: true } }, media: true } },
          common_amenities: { include: { amenity: true } },
          media: true,
          user: { select: { id: true, name: true, age: true, profile_picture_url: true } }
        },
      });
    });
  }

  async createFlatWithMedia(flatData: any, flatMedia: any[]) {
    return prisma.$transaction(async (tx) => {
      const flat = await tx.flat.create({ data: flatData });
      if (flatMedia && flatMedia.length > 0) {
        await tx.flatMedia.createMany({
          data: flatMedia.map((m: any, i: number) => ({
            flat_id: flat.id,
            media_url: typeof m === 'string' ? m : m.url || m.media_url,
            display_order: i
          }))
        });
      }
      return tx.flat.findUnique({
        where: { id: flat.id },
        include: {
          media: true,
          user: { select: { id: true, name: true, age: true, profile_picture_url: true } }
        }
      });
    });
  }
}
