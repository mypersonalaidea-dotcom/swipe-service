import { DiscoverRepository } from './discover.repository';
import { UserFormatter } from '../../utils/user-formatter';
import { FlatFormatter } from '../../utils/flat-formatter';

const discoverRepo = new DiscoverRepository();

const DEFAULT_PAGE_SIZE = 3;

export class DiscoverService {
  /**
   * Returns paginated profile cards for the homepage feed.
   * Each page returns `limit` cards (default 3).
   * Visited profiles are automatically excluded.
   */
  async getFeed(userId: string, page: number, limit: number = DEFAULT_PAGE_SIZE) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(limit, 20)); // cap at 20 max

    const { profiles, totalCount } = await discoverRepo.getFeedProfiles(userId, safePage, safeLimit);

    // Format each profile card (strip password_hash, format flats/user data)
    const cards = profiles.map((profile: any) => {
      let { password_hash: _, ...safeProfile } = profile;

      // Format flats
      if (safeProfile.flats && Array.isArray(safeProfile.flats)) {
        safeProfile.flats = safeProfile.flats.map((f: any) => FlatFormatter.formatFlat(f));
      }

      // Format user fields
      safeProfile = UserFormatter.formatUser(safeProfile);
      return safeProfile;
    });

    const totalPages = Math.ceil(totalCount / safeLimit);
    const hasMore = safePage < totalPages;

    return {
      cards,
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalCards: totalCount,
        totalPages,
        hasMore,
      },
    };
  }

  /**
   * Mark profiles as visited so they don't appear in future feed pages.
   */
  async markVisited(userId: string, profileIds: string[]) {
    if (!profileIds.length) return { marked: 0 };
    const results = await discoverRepo.markVisited(userId, profileIds);
    return { marked: results.length };
  }

  /**
   * Clear all visited profiles — essentially resets the feed for the user.
   */
  async clearVisited(userId: string) {
    const result = await discoverRepo.clearVisited(userId);
    return { cleared: result.count };
  }

  /**
   * Get count of visited profiles.
   */
  async getVisitedCount(userId: string) {
    const count = await discoverRepo.getVisitedCount(userId);
    return { count };
  }
}
