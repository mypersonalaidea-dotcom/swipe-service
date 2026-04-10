import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { MessagingRepository } from './messaging.repository';
import { MessagingService } from './messaging.service';

const repo = new MessagingRepository();
const messagingService = new MessagingService();

// ─── Online presence: userId → Set of socketIds ───────────────────────────────
const onlineUsers = new Map<string, Set<string>>();

function addOnline(userId: string, socketId: string) {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId)!.add(socketId);
}

function removeOnline(userId: string, socketId: string) {
  const sockets = onlineUsers.get(userId);
  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) onlineUsers.delete(userId);
  }
}

export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId) && onlineUsers.get(userId)!.size > 0;
}

// ─── Room helpers ─────────────────────────────────────────────────────────────
const userRoom = (userId: string) => `user:${userId}`;
const convRoom = (conversationId: string) => `conv:${conversationId}`;

// ─── Setup ────────────────────────────────────────────────────────────────────
export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: (env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map((o) => o.trim()),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ─── JWT Authentication Middleware ──────────────────────────────────────────
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      (socket as any).userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  // ─── Connection ─────────────────────────────────────────────────────────────
  io.on('connection', async (socket: Socket) => {
    const userId: string = (socket as any).userId;
    logger.info(`[Socket] User connected: ${userId} (${socket.id})`);

    // Register presence
    addOnline(userId, socket.id);

    // Join the user's private room (for targeted server → client pushes)
    socket.join(userRoom(userId));

    // Deliver any messages that were 'sent' (not yet delivered) while user was offline
    await deliverPendingMessages(io, userId);

    // Broadcast online status to all conversation partners
    await broadcastPresence(io, userId, true);

    // Give the connecting user the online status of all their partners
    try {
      const conversationIds = await repo.getUserConversationIds(userId);
      const partnerIds = new Set<string>();
      for (const convId of conversationIds) {
        const otherIds = await repo.getOtherParticipantIds(convId, userId);
        for (const partnerId of otherIds) partnerIds.add(partnerId);
      }
      
      for (const partnerId of partnerIds) {
        if (isUserOnline(partnerId)) {
          socket.emit('user_online', {
            user_id: partnerId,
            is_online: true,
            last_seen_at: null
          });
        }
      }
    } catch (err) {
      logger.error('[Socket] Failed to push existing presence:', err);
    }

    // ── join_conversation ──────────────────────────────────────────────────────
    socket.on('join_conversation', async ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      // Verify user is a participant
      const conv = await repo.getConversationById(conversationId, userId);
      if (!conv) {
        return socket.emit('error', { message: 'Conversation not found or access denied' });
      }
      socket.join(convRoom(conversationId));
      socket.emit('joined_conversation', { conversationId });
      logger.info(`[Socket] ${userId} joined conv ${conversationId}`);
    });

    // ── leave_conversation ─────────────────────────────────────────────────────
    socket.on('leave_conversation', ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      socket.leave(convRoom(conversationId));
      logger.info(`[Socket] ${userId} left conv ${conversationId}`);
    });

    // ── send_message ───────────────────────────────────────────────────────────
    socket.on(
      'send_message',
      async (payload: {
        conversationId: string;
        content?: string;
        messageType?: string; // 'text' | 'image' | 'video' | 'audio'
        mediaUrl?: string;
        replyToId?: string;
        tempId?: string;       // client-side temp id for optimistic UI
      }) => {
        const { conversationId, content, messageType, mediaUrl, replyToId, tempId } = payload;

        if (!conversationId) {
          return socket.emit('error', { message: 'conversationId is required' });
        }
        if (!content && !mediaUrl) {
          return socket.emit('error', { message: 'content or mediaUrl is required' });
        }

        try {
          // Verify sender is a participant
          const conv = await repo.getConversationById(conversationId, userId);
          if (!conv) {
            return socket.emit('error', { message: 'Conversation not found or access denied' });
          }

          // Persist message
          const message = await repo.createMessage({
            conversation_id: conversationId,
            sender_id: userId,
            content,
            message_type: messageType ?? 'text',
            media_url: mediaUrl,
            reply_to_id: replyToId,
          });

          // Update conversation preview
          await repo.updateConversationLastMessage(
            conversationId,
            content || `[${messageType ?? 'media'}]`,
          );

          // Increment unread for other participants
          await repo.incrementUnreadForOthers(conversationId, userId);

          const formatted = messagingService.formatMessage(message);

          // ── Ack sender with final message (replaces optimistic copy) ──────────
          socket.emit('message_sent', { tempId, message: formatted });

          // ── Deliver to other participants ──────────────────────────────────────
          const otherIds = await repo.getOtherParticipantIds(conversationId, userId);

          let deliveredToAny = false;
          for (const recipientId of otherIds) {
            // Emit to recipient's user room — covers all their active tabs/devices
            io.to(userRoom(recipientId)).emit('new_message', { message: formatted });

            if (isUserOnline(recipientId)) {
              deliveredToAny = true;
            }
          }

          // ── Update delivery status ─────────────────────────────────────────────
          if (deliveredToAny) {
            await repo.markMessageDelivered(message.id);
            // Notify sender that message was delivered
            socket.emit('message_delivered', {
              messageId: message.id,
              conversationId,
              deliveredAt: new Date().toISOString(),
            });
          }

          // Also broadcast to conversation room (for open chat windows)
          socket.to(convRoom(conversationId)).emit('new_message', { message: formatted });

          // Update recipient's conversation list
          for (const recipientId of otherIds) {
            io.to(userRoom(recipientId)).emit('conversation_updated', {
              conversationId,
              last_message: formatted,
            });
          }
        } catch (err: any) {
          logger.error('[Socket] send_message error:', err);
          socket.emit('error', { message: err.message });
        }
      },
    );

    // ── mark_read ──────────────────────────────────────────────────────────────
    socket.on('mark_read', async ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;

      try {
        const conv = await repo.getConversationById(conversationId, userId);
        if (!conv) return;

        // Get message senders BEFORE marking as seen, so we know who to notify
        const unread = await repo.getUndeliveredMessageIds(conversationId, userId);

        await repo.markConversationSeen(conversationId, userId);

        // Notify original sender(s) that their messages are seen
        const senderIds = [...new Set(unread.map((m) => m.sender_id))];
        for (const senderId of senderIds) {
          io.to(userRoom(senderId)).emit('message_seen', {
            conversationId,
            seenBy: userId,
            seenAt: new Date().toISOString(),
          });
        }

        // Also notify via the conversation room
        socket.to(convRoom(conversationId)).emit('message_seen', {
          conversationId,
          seenBy: userId,
          seenAt: new Date().toISOString(),
        });
      } catch (err: any) {
        logger.error('[Socket] mark_read error:', err);
      }
    });

    // ── typing_start ───────────────────────────────────────────────────────────
    socket.on('typing_start', ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      socket.to(convRoom(conversationId)).emit('typing', {
        conversationId,
        userId,
        isTyping: true,
      });
    });

    // ── typing_stop ────────────────────────────────────────────────────────────
    socket.on('typing_stop', ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      socket.to(convRoom(conversationId)).emit('typing', {
        conversationId,
        userId,
        isTyping: false,
      });
    });

    // ── disconnect ─────────────────────────────────────────────────────────────
    socket.on('disconnect', async (reason) => {
      logger.info(`[Socket] User disconnected: ${userId} (${socket.id}) — ${reason}`);
      removeOnline(userId, socket.id);

      // Persist last seen timestamp
      try {
        await repo.touchUserLastSeen(userId);
      } catch (err) {
        logger.error('[Socket] Failed to update last seen:', err);
      }

      // Broadcast offline status only if no other sockets for this user
      if (!isUserOnline(userId)) {
        await broadcastPresence(io, userId, false);
      }
    });
  });

  return io;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Broadcast online/offline status to all users who share a conversation
 * with the changed user.
 */
async function broadcastPresence(io: Server, userId: string, isOnline: boolean) {
  try {
    const user = await repo.getUserLastSeen(userId);
    const conversationIds = await repo.getUserConversationIds(userId);

    const presencePayload = {
      user_id: userId,
      is_online: isOnline,
      last_seen_at: isOnline ? null : (user?.last_login_at?.toISOString() ?? null),
    };

    for (const convId of conversationIds) {
      // Emit to the conversation room so the open chat screen can update
      io.to(convRoom(convId)).emit('user_online', presencePayload);

      // Also get other participants and push to their private user rooms
      const otherIds = await repo.getOtherParticipantIds(convId, userId);
      for (const otherId of otherIds) {
        io.to(userRoom(otherId)).emit('user_online', presencePayload);
      }
    }
  } catch (err) {
    logger.error('[Socket] broadcastPresence error:', err);
  }
}

/**
 * When a user comes online, upgrade any 'sent' messages in their conversations
 * to 'delivered' and notify the original senders.
 */
async function deliverPendingMessages(io: Server, userId: string) {
  try {
    const conversationIds = await repo.getUserConversationIds(userId);

    for (const convId of conversationIds) {
      const pending = await repo.getUndeliveredMessageIds(convId, userId);
      if (pending.length === 0) continue;

      // Mark as delivered in bulk via conversation
      await repo.markMessageDelivered(pending[0].id); // minimal — one call per conv

      const senderIds = [...new Set(pending.map((m) => m.sender_id))];
      for (const senderId of senderIds) {
        io.to(userRoom(senderId)).emit('message_delivered', {
          conversationId: convId,
          deliveredAt: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    logger.error('[Socket] deliverPendingMessages error:', err);
  }
}
