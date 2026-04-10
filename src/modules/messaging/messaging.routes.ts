import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { MessagingController } from './messaging.controller';

const router = Router();
const ctrl = new MessagingController();

// ─── Conversations ────────────────────────────────────────────────────────────
// Start or retrieve a 1-to-1 conversation
router.post('/conversations', authMiddleware, ctrl.getOrCreateConversation.bind(ctrl));

// List all conversations for the authenticated user
router.get('/conversations', authMiddleware, ctrl.listConversations.bind(ctrl));

// Get paginated messages for a conversation
// Query: ?cursor=<messageId>  — for infinite-scroll pagination (older messages)
router.get('/conversations/:conversationId', authMiddleware, ctrl.getMessages.bind(ctrl));

// Mark all messages in a conversation as read
router.post('/conversations/:conversationId/read', authMiddleware, ctrl.markRead.bind(ctrl));

// Archive (soft-delete) a conversation (only for the current user)
router.delete('/conversations/:conversationId', authMiddleware, ctrl.archiveConversation.bind(ctrl));

// ─── Presence ─────────────────────────────────────────────────────────────────
// Get last-seen timestamp for a user (online status resolved via socket)
router.get('/presence/:userId', authMiddleware, ctrl.getUserPresence.bind(ctrl));

export default router;
