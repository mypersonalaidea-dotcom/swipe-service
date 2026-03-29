import { UserFormatter } from './user-formatter';

export class FlatFormatter {
  static formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  static formatFlat(flat: any) {
    if (!flat) return flat;

    // Coerce top-level Decimal fields to numbers
    if (flat.latitude !== undefined && flat.latitude !== null) flat.latitude = Number(flat.latitude);
    if (flat.longitude !== undefined && flat.longitude !== null) flat.longitude = Number(flat.longitude);

    // Map common amenities to just their names
    if (flat.common_amenities && Array.isArray(flat.common_amenities)) {
      flat.common_amenities = flat.common_amenities
        .map((ca: any) => ca.amenity?.name || ca.name)
        .filter(Boolean);
    }

    // Flatten flat media into photos array
    if (flat.media && Array.isArray(flat.media)) {
      flat.photos = flat.media.map((m: any) => m.media_url).filter(Boolean);
    } else {
      flat.photos = [];
    }

    if (flat.rooms && Array.isArray(flat.rooms)) {
      flat.rooms = flat.rooms.map((r: any) => {
        const room = {
          ...r,
          available_from: this.formatDate(r.available_from)
        };

        // Coerce room Decimal fields to numbers
        if (room.rent !== undefined && room.rent !== null) room.rent = Number(room.rent);
        if (room.security_deposit !== undefined && room.security_deposit !== null) room.security_deposit = Number(room.security_deposit);
        if (room.brokerage !== undefined && room.brokerage !== null) room.brokerage = Number(room.brokerage);

        // Map room amenities to just their names
        if (r.room_amenities && Array.isArray(r.room_amenities)) {
          room.room_amenities = r.room_amenities
            .map((ra: any) => ra.amenity?.name || ra.name)
            .filter(Boolean);
        }

        // Flatten room media into photos array
        if (r.media && Array.isArray(r.media)) {
          room.photos = r.media.map((m: any) => m.media_url).filter(Boolean);
        } else {
          room.photos = [];
        }

        return room;
      });
    }

    // Format user if present
    if (flat.user) {
      flat.user = UserFormatter.formatUser(flat.user);
    }

    return flat;
  }
}
