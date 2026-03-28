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

    // Map common amenities to just their names
    if (flat.common_amenities && Array.isArray(flat.common_amenities)) {
      flat.common_amenities = flat.common_amenities
        .map((ca: any) => ca.amenity?.name || ca.name)
        .filter(Boolean);
    }

    if (flat.rooms && Array.isArray(flat.rooms)) {
      flat.rooms = flat.rooms.map((r: any) => {
        const room = {
          ...r,
          available_from: this.formatDate(r.available_from)
        };

        // Map room amenities to just their names
        if (r.room_amenities && Array.isArray(r.room_amenities)) {
          room.room_amenities = r.room_amenities
            .map((ra: any) => ra.amenity?.name || ra.name)
            .filter(Boolean);
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
