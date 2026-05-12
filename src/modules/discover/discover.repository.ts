import { prisma } from '../../config/database';

export class DiscoverRepository {
  /**
   * Fetch profile cards for the homepage feed.
   *
   * Excludes:
   *  - The requesting user themselves
   *  - Profiles the user has already visited
   *  - Profiles that are not published / not active
   *
   * Returns `limit` profiles at a time (cursor-based pagination via `page`).
   */
  async getFeedProfiles(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Get all visited profile IDs for this user
    // Wrapped in try-catch so the feed still works if the migration hasn't been deployed yet
    let visitedIds: string[] = [];
    try {
      const visitedRecords = await prisma.visitedProfile.findMany({
        where: { user_id: userId },
        select: { visited_user_id: true },
      });
      visitedIds = visitedRecords.map((v) => v.visited_user_id);
    } catch (err) {
      console.error('[DiscoverRepo] Failed to fetch visited profiles (migration may not be applied):', err);
    }

    // Also exclude blocked users (both directions)
    const blocks = await prisma.userBlock.findMany({
      where: {
        OR: [
          { blocker_id: userId },
          { blocked_user_id: userId },
        ],
        status: 'active',
      },
      select: { blocker_id: true, blocked_user_id: true },
    });
    const blockedIds = blocks.map((b) =>
      b.blocker_id === userId ? b.blocked_user_id : b.blocker_id
    );

    const excludeIds = [...new Set([userId, ...visitedIds, ...blockedIds])];

    const [profiles, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          id: { notIn: excludeIds },
          // Only exclude profiles that are explicitly unpublished (false).
          // Profiles with is_published = true OR null will be included.
          is_published: { not: false },
          status: 'active',
        },
        include: {
          job_experiences: { include: { company: true, position: true } },
          education_experiences: { include: { institution: true, degree: true } },
          user_habits: { include: { habit: true } },
          looking_for_habits: { include: { habit: true } },
          flats: {
            where: { status: 'active' },
            include: {
              rooms: {
                where: { status: 'active' },
                include: {
                  room_amenities: { include: { amenity: true } },
                  media: { where: { status: 'active' } },
                },
              },
              common_amenities: { include: { amenity: true } },
              media: { where: { status: 'active' } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count({
        where: {
          id: { notIn: excludeIds },
          is_published: { not: false },
          status: 'active',
        },
      }),
    ]);

    return { profiles, totalCount };
  }

  /**
   * Mark one or more profiles as visited for a user.
   * Uses upsert so duplicate calls are idempotent.
   */
  async markVisited(userId: string, visitedUserIds: string[]) {
    const upserts = visitedUserIds.map((visited_user_id) =>
      prisma.visitedProfile.upsert({
        where: {
          user_id_visited_user_id: { user_id: userId, visited_user_id },
        },
        update: {},           // already exists, nothing to change
        create: { user_id: userId, visited_user_id },
      })
    );
    return Promise.all(upserts);
  }

  /**
   * Clear all visited profiles for a user so they appear in the feed again.
   */
  async clearVisited(userId: string) {
    return prisma.visitedProfile.deleteMany({
      where: { user_id: userId },
    });
  }

  /**
   * Get count of visited profiles for a user.
   */
  async getVisitedCount(userId: string) {
    return prisma.visitedProfile.count({
      where: { user_id: userId },
    });
  }
}
