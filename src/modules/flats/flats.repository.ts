import { prisma } from '../../config/database';

export class FlatsRepository {
  async getFlats(query: any) {
    const {
      latitude, longitude, radius_km,
      min_rent, max_rent,
      flat_types, furnishing_types,
      room_types, available_from,
      brokerage, security_deposit,
      room_amenities, common_amenities,
      age_min, age_max,
      companies, schools, habits
    } = query;

    const toArray = (v: any) => {
      if (!v) return undefined;
      if (Array.isArray(v)) return v;
      return String(v).split(',').map(s => s.trim()).filter(Boolean);
    };

    const ftArr = toArray(flat_types);
    const furArr = toArray(furnishing_types);
    const rtArr = toArray(room_types);
    const raArr = toArray(room_amenities);
    const caArr = toArray(common_amenities);
    const habitArr = toArray(habits);
    const compArr = toArray(companies);
    const schoolArr = toArray(schools);

    const where: any = {
      status: 'active',
      is_published: true,
    };

    // Flat level
    if (ftArr) where.flat_type = { in: ftArr };
    if (furArr) where.furnishing_type = { in: furArr };
    if (caArr) {
      where.common_amenities = {
        some: {
          amenity: { name: { in: caArr } }
        }
      };
    }

    // Room level
    const roomWhere: any = { status: 'active' };
    if (min_rent !== undefined || max_rent !== undefined) {
      roomWhere.rent = {
        gte: min_rent ? Number(min_rent) : undefined,
        lte: max_rent ? Number(max_rent) : undefined,
      };
    }
    if (rtArr) roomWhere.room_type = { in: rtArr };
    if (available_from) roomWhere.available_from = { lte: new Date(available_from) };
    
    if (brokerage === 'no') {
      roomWhere.brokerage = 0;
    } else if (brokerage && !isNaN(Number(brokerage))) {
      roomWhere.brokerage = { lte: Number(brokerage) };
    }

    if (security_deposit === 'none') {
      roomWhere.security_deposit = 0;
    } else if (security_deposit && !isNaN(Number(security_deposit))) {
      roomWhere.security_deposit = { lte: Number(security_deposit) };
    }

    if (raArr) {
      roomWhere.room_amenities = {
        some: {
          amenity: { name: { in: raArr } }
        }
      };
    }

    where.rooms = { some: roomWhere };

    // User level
    const userWhere: any = { status: 'active' };
    if (age_min !== undefined || age_max !== undefined) {
      userWhere.age = {
        gte: age_min ? Number(age_min) : undefined,
        lte: age_max ? Number(age_max) : undefined,
      };
    }
    if (habitArr) {
      userWhere.user_habits = {
        some: { habit: { label: { in: habitArr } }, status: 'active' }
      };
    }
    if (compArr) {
      userWhere.job_experiences = {
        some: {
          OR: [
            { company: { name: { in: compArr } } },
            { company_name: { in: compArr } }
          ],
          status: 'active'
        }
      };
    }
    if (schoolArr) {
      userWhere.education_experiences = {
        some: {
          OR: [
            { institution: { name: { in: schoolArr } } },
            { institution_name: { in: schoolArr } }
          ],
          status: 'active'
        }
      };
    }

    where.user = userWhere;

    // Geospatial (Manual calculation for a bounding box approach if not using $queryRaw)
    // For now, let's use standard Prisma. If lat/lng/rad are provided, we should ideally use ST_DWithin.
    // If I cannot use PostGIS easily, I'll stick to Prisma and maybe add a TODO or basic logic.
    // However, I'll try to use raw SQL for geospatial if latitude is provided.

    if (latitude && longitude && radius_km) {
        const lat = Number(latitude);
        const lng = Number(longitude);
        const rad = Number(radius_km) * 1000; // to meters

        // Using a raw SQL to get IDs within distance first
        // Haversine formula
        const flatIdsWithinRadius = await prisma.$queryRaw<any[]>`
          SELECT id FROM flats
          WHERE (
            6371 * acos(
              cos(radians(${lat})) * cos(radians(latitude)) * 
              cos(radians(longitude) - radians(${lng})) + 
              sin(radians(${lat})) * sin(radians(latitude))
            )
          ) <= ${Number(radius_km)}
        `;

        const ids = flatIdsWithinRadius.map((f: any) => f.id);
        where.id = { in: ids };
    }

    return prisma.flat.findMany({
      where,
      include: {
        rooms: { 
          where: roomWhere,
          include: { 
            room_amenities: { include: { amenity: true } }, 
            media: true 
          } 
        },
        common_amenities: { include: { amenity: true } },
        media: true,
        user: { 
          select: { 
            id: true, 
            name: true, 
            age: true, 
            gender: true,
            profile_picture_url: true,
            user_habits: { include: { habit: true } },
            job_experiences: { include: { company: true, position: true } },
            education_experiences: { include: { institution: true, degree: true } }
          } 
        }
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
        user: { 
          select: { 
            id: true, 
            name: true, 
            age: true, 
            gender: true,
            profile_picture_url: true,
            user_habits: { include: { habit: true } },
            job_experiences: { include: { company: true, position: true } },
            education_experiences: { include: { institution: true, degree: true } }
          } 
        }
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
        const { room_amenities: roomAmenityInput, media: roomMedia, ...roomFields } = room as any;
        const amenityNames = Array.isArray(roomAmenityInput) 
          ? roomAmenityInput.map(s => String(s).trim()).filter(Boolean) 
          : [];

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

        // Link room amenities by name (Case-insensitive)
        if (amenityNames.length > 0) {
          const masterAmenities = await tx.masterAmenity.findMany({
            where: {
              OR: [
                { name: { in: amenityNames, mode: 'insensitive' } },
              ]
            }
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

      // 3. Link common amenities by name (Case-insensitive)
      if (commonAmenities && commonAmenities.length > 0) {
        const cleanNames = commonAmenities.map(s => String(s).trim()).filter(Boolean);
        const masterAmenities = await tx.masterAmenity.findMany({
          where: {
            OR: [
              { name: { in: cleanNames, mode: 'insensitive' } },
            ]
          }
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
          user: { 
            select: { 
              id: true, 
              name: true, 
              age: true, 
              gender: true,
              profile_picture_url: true,
              user_habits: { include: { habit: true } },
              job_experiences: { include: { company: true, position: true } },
              education_experiences: { include: { institution: true, degree: true } }
            } 
          }
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
          user: { 
            select: { 
              id: true, 
              name: true, 
              age: true, 
              gender: true,
              profile_picture_url: true,
              user_habits: { include: { habit: true } },
              job_experiences: { include: { company: true, position: true } },
              education_experiences: { include: { institution: true, degree: true } }
            } 
          }
        }
      });
    });
  }
}
