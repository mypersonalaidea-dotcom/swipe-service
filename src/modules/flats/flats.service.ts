import { FlatsRepository } from './flats.repository';

const flatsRepo = new FlatsRepository();

// Only these fields may be written by the client when creating a flat.
// user_id is injected server-side from the JWT — not from the request body.
const FLAT_ALLOWED_FIELDS = [
  'address', 'city', 'state', 'pincode',
  'latitude', 'longitude',
  'furnishing_type', 'flat_type', 'description', 'is_published',
  'user_id', // injected server-side, not from body
] as const;

export class FlatsService {
  async getFlats() {
    return await flatsRepo.getFlats();
  }

  async getFlatById(id: string) {
    return await flatsRepo.getFlatById(id);
  }

  async createFlat(data: any) {
    // Validate required fields
    if (!data.address || !data.city || !data.state) {
      throw new Error('address, city, and state are required');
    }

    // Whitelist — only allow known fields to reach the DB
    const safeData: Record<string, any> = {};
    for (const key of FLAT_ALLOWED_FIELDS) {
      if (data[key] !== undefined) safeData[key] = data[key];
    }

    // Coerce lat/lng to Number for Prisma's Decimal column.
    if (safeData.latitude !== undefined) {
      const lat = Number(safeData.latitude);
      if (!isFinite(lat)) delete safeData.latitude;
      else safeData.latitude = lat;
    }
    if (safeData.longitude !== undefined) {
      const lng = Number(safeData.longitude);
      if (!isFinite(lng)) delete safeData.longitude;
      else safeData.longitude = lng;
    }

    // If rooms are provided, use the nested creation path
    const rooms = data.rooms as any[] | undefined;
    const commonAmenities = data.common_amenities as string[] | undefined;

    if (rooms && rooms.length > 0) {
      return await flatsRepo.createFlatWithRooms(safeData, rooms, commonAmenities);
    }

    return await flatsRepo.createFlat(safeData);
  }
}
