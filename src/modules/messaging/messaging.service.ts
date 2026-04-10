import { prisma } from '../../config/database';
import { MessagingRepository } from './messaging.repository';

const repo = new MessagingRepository();

const MESSAGE_PAGE_SIZE = 30;

export class MessagingService {
  // ─── Conversations ───────────────────────────────────────────────────────

  /**
   * Start or retrieve a 1-to-1 conversation between the caller and another user.
   * Any two users may initiate a conversation.
   */
  async getOrCreateConversation(myUserId: string, otherUserId: string) {
    if (myUserId === otherUserId) {
      throw new Error('You cannot start a conversation with yourself');
    }

    // Check other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true, name: true, profile_picture_url: true, status: true },
    });
    if (!otherUser || otherUser.status !== 'active') {
      throw new Error('User not found');
    }

    // Check if conversation already exists
    const existingId = await repo.findOneToOneConversation(myUserId, otherUserId);
    if (existingId) {
      const conv = await repo.getConversationById(existingId, myUserId);
      return { conversation: this.formatConversation(conv, myUserId), isNew: false };
    }

    // Create brand-new conversation
    const conv = await repo.createConversation(myUserId, otherUserId);
    return { conversation: this.formatConversation(conv, myUserId), isNew: true };
  }

  /** List all conversations for the authenticated user */
  async listConversations(myUserId: string) {
    const conversations = await repo.listConversations(myUserId);
    return conversations.map((c) => this.formatConversationListItem(c, myUserId));
  }

  /** Soft-delete the conversation for the current user */
  async archiveConversation(conversationId: string, userId: string) {
    const conv = await repo.getConversationById(conversationId, userId);
    if (!conv) throw new Error('Conversation not found');
    await repo.archiveConversation(conversationId, userId);
    return { archived: true };
  }

  // ─── Messages ────────────────────────────────────────────────────────────

  /** Get paginated messages for a conversation */
  async getMessages(conversationId: string, userId: string, cursor: string | null) {
    const conv = await repo.getConversationById(conversationId, userId);
    if (!conv) throw new Error('Conversation not found');

    const messages = await repo.getMessages(conversationId, cursor, MESSAGE_PAGE_SIZE + 1);
    const hasMore = messages.length > MESSAGE_PAGE_SIZE;
    const page = hasMore ? messages.slice(0, MESSAGE_PAGE_SIZE) : messages;
    const nextCursor = hasMore ? page[page.length - 1].id : null;

    return {
      messages: page.map(this.formatMessage),
      nextCursor,
      hasMore,
    };
  }

  /** Mark all messages in a conversation as read (REST fallback) */
  async markRead(conversationId: string, userId: string) {
    const conv = await repo.getConversationById(conversationId, userId);
    if (!conv) throw new Error('Conversation not found');
    await repo.markConversationSeen(conversationId, userId);
    return { success: true };
  }

  /** Get presence + last seen info for a user */
  async getUserPresence(targetUserId: string) {
    const user = await repo.getUserLastSeen(targetUserId);
    if (!user) throw new Error('User not found');
    return {
      user_id: user.id,
      last_seen_at: user.last_login_at,
      // isOnline is resolved by the socket layer (in-memory map) — REST returns DB value only
    };
  }

  // ─── Formatters ──────────────────────────────────────────────────────────

  formatConversation(conv: any, myUserId: string) {
    const otherParticipant = conv.participants?.find((p: any) => p.user_id !== myUserId);
    const myParticipant = conv.participants?.find((p: any) => p.user_id === myUserId);

    return {
      id: conv.id,
      other_user: otherParticipant
        ? {
            id: otherParticipant.user.id,
            name: otherParticipant.user.name,
            profile_picture_url: otherParticipant.user.profile_picture_url,
            last_seen_at: otherParticipant.user.last_login_at,
          }
        : null,
      unread_count: myParticipant?.unread_count ?? 0,
      muted: myParticipant?.muted ?? false,
      last_message_at: conv.last_message_at,
      status: conv.status,
      created_at: conv.created_at,
    };
  }

  formatConversationListItem(conv: any, myUserId: string) {
    const base = this.formatConversation(conv, myUserId);
    const lastMsg = conv.messages?.[0] ?? null;
    return {
      ...base,
      last_message: lastMsg
        ? {
            id: lastMsg.id,
            content: lastMsg.content,
            message_type: lastMsg.message_type,
            sender_id: lastMsg.sender_id,
            delivery_status: lastMsg.delivery_status,
            created_at: lastMsg.created_at,
            is_mine: lastMsg.sender_id === myUserId,
          }
        : null,
    };
  }

  formatMessage(msg: any) {
    return {
      id: msg.id,
      conversation_id: msg.conversation_id,
      sender: {
        id: msg.sender.id,
        name: msg.sender.name,
        profile_picture_url: msg.sender.profile_picture_url,
      },
      content: msg.content,
      message_type: msg.message_type,
      media_url: msg.media_url,
      delivery_status: msg.delivery_status,
      reply_to: msg.reply_to
        ? {
            id: msg.reply_to.id,
            content: msg.reply_to.content,
            message_type: msg.reply_to.message_type,
            sender: msg.reply_to.sender,
          }
        : null,
      created_at: msg.created_at,
      updated_at: msg.updated_at,
    };
  }
}
