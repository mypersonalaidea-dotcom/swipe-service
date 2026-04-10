import { prisma } from '../../config/database';

export class MessagingRepository {
  // ─── Conversations ───────────────────────────────────────────────────────

  /** Find an existing 1-to-1 conversation between two users */
  async findOneToOneConversation(userAId: string, userBId: string) {
    // A conversation where BOTH users are participants
    const rows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT c.id
      FROM conversations c
      JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = ${userAId}::uuid AND cp1.status = 'active'
      JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = ${userBId}::uuid AND cp2.status = 'active'
      WHERE c.status = 'active'
      -- ensure it's exactly 2 participants (1-to-1)
      AND (
        SELECT COUNT(*) FROM conversation_participants cp3
        WHERE cp3.conversation_id = c.id AND cp3.status = 'active'
      ) = 2
      LIMIT 1
    `;
    return rows[0]?.id ?? null;
  }

  /** Create a new conversation with two participants */
  async createConversation(initiatorId: string, otherUserId: string) {
    return prisma.conversation.create({
      data: {
        initiated_by: initiatorId,
        status: 'active',
        participants: {
          create: [
            { user_id: initiatorId },
            { user_id: otherUserId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_picture_url: true,
                last_login_at: true,
              },
            },
          },
        },
      },
    });
  }

  /** Get conversation by id, verifying the requesting user is a participant */
  async getConversationById(conversationId: string, userId: string) {
    return prisma.conversation.findFirst({
      where: {
        id: conversationId,
        status: 'active',
        participants: {
          some: { user_id: userId, status: 'active' },
        },
      },
      include: {
        participants: {
          where: { status: 'active' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_picture_url: true,
                last_login_at: true,
              },
            },
          },
        },
      },
    });
  }

  /** List all conversations for a user, ordered by latest message */
  async listConversations(userId: string) {
    return prisma.conversation.findMany({
      where: {
        status: 'active',
        participants: {
          some: { user_id: userId, status: 'active' },
        },
      },
      include: {
        participants: {
          where: { status: 'active' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_picture_url: true,
                last_login_at: true,
              },
            },
          },
        },
        messages: {
          orderBy: { created_at: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            message_type: true,
            sender_id: true,
            delivery_status: true,
            created_at: true,
          },
        },
      },
      orderBy: { last_message_at: 'desc' },
    });
  }

  /** Get participant record for a specific user in a conversation */
  async getParticipant(conversationId: string, userId: string) {
    return prisma.conversationParticipant.findUnique({
      where: {
        conversation_id_user_id: { conversation_id: conversationId, user_id: userId },
      },
    });
  }

  /** Update conversation's last message preview & timestamp */
  async updateConversationLastMessage(conversationId: string, preview: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: {
        last_message_at: new Date(),
        last_message_preview: preview,
        updated_at: new Date(),
      },
    });
  }

  /** Increment unread count for all participants EXCEPT the sender */
  async incrementUnreadForOthers(conversationId: string, senderId: string) {
    return prisma.conversationParticipant.updateMany({
      where: {
        conversation_id: conversationId,
        user_id: { not: senderId },
        status: 'active',
      },
      data: { unread_count: { increment: 1 } },
    });
  }

  /** Archive (soft-delete) a conversation for the current user */
  async archiveConversation(conversationId: string, userId: string) {
    return prisma.conversationParticipant.updateMany({
      where: { conversation_id: conversationId, user_id: userId },
      data: { status: 'deleted' },
    });
  }

  // ─── Messages ────────────────────────────────────────────────────────────

  /** Paginate messages in a conversation, newest first */
  async getMessages(conversationId: string, cursor: string | null, limit: number) {
    return prisma.message.findMany({
      where: {
        conversation_id: conversationId,
        status: 'active',
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile_picture_url: true,
          },
        },
        reply_to: {
          select: {
            id: true,
            content: true,
            message_type: true,
            sender: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  /** Persist a new message */
  async createMessage(data: {
    conversation_id: string;
    sender_id: string;
    content?: string;
    message_type?: string;
    media_url?: string;
    reply_to_id?: string;
  }) {
    return prisma.message.create({
      data: {
        conversation_id: data.conversation_id,
        sender_id: data.sender_id,
        content: data.content,
        message_type: data.message_type ?? 'text',
        media_url: data.media_url,
        reply_to_id: data.reply_to_id,
        delivery_status: 'sent',
        status: 'active',
      },
      include: {
        sender: {
          select: { id: true, name: true, profile_picture_url: true },
        },
        reply_to: {
          select: {
            id: true,
            content: true,
            message_type: true,
            sender: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  /** Mark a single message as delivered */
  async markMessageDelivered(messageId: string) {
    return prisma.message.updateMany({
      where: { id: messageId, delivery_status: 'sent' },
      data: { delivery_status: 'delivered', updated_at: new Date() },
    });
  }

  /** Mark all messages sent by others in a conversation as seen */
  async markConversationSeen(conversationId: string, readerUserId: string) {
    // Update delivery_status on all messages not sent by the reader
    await prisma.message.updateMany({
      where: {
        conversation_id: conversationId,
        sender_id: { not: readerUserId },
        delivery_status: { in: ['sent', 'delivered'] },
        status: 'active',
      },
      data: { delivery_status: 'seen', updated_at: new Date() },
    });

    // Reset unread count & update last_read_at for the reader
    await prisma.conversationParticipant.updateMany({
      where: { conversation_id: conversationId, user_id: readerUserId },
      data: { unread_count: 0, last_read_at: new Date(), updated_at: new Date() },
    });
  }

  /** IDs of all messages in a conversation that are still 'sent' (not yet delivered or seen) */
  async getUndeliveredMessageIds(conversationId: string, recipientUserId: string) {
    const rows = await prisma.message.findMany({
      where: {
        conversation_id: conversationId,
        sender_id: { not: recipientUserId },
        delivery_status: 'sent',
        status: 'active',
      },
      select: { id: true, sender_id: true },
    });
    return rows;
  }

  /** Get ids of all other participants in a conversation */
  async getOtherParticipantIds(conversationId: string, excludeUserId: string) {
    const rows = await prisma.conversationParticipant.findMany({
      where: {
        conversation_id: conversationId,
        user_id: { not: excludeUserId },
        status: 'active',
      },
      select: { user_id: true },
    });
    return rows.map((r) => r.user_id);
  }

  /** Update user's last_login_at for last-seen tracking */
  async touchUserLastSeen(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { last_login_at: new Date() },
    });
  }

  /** Get user's last_login_at */
  async getUserLastSeen(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, last_login_at: true, name: true, profile_picture_url: true },
    });
  }

  /** Get all conversation IDs a user participates in */
  async getUserConversationIds(userId: string) {
    const rows = await prisma.conversationParticipant.findMany({
      where: { user_id: userId, status: 'active' },
      select: { conversation_id: true },
    });
    return rows.map((r) => r.conversation_id);
  }
}
