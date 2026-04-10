import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { MessagingService } from './messaging.service';

const messagingService = new MessagingService();

export class MessagingController {
  // POST /api/v1/messages/conversations
  async getOrCreateConversation(req: AuthRequest, res: Response) {
    try {
      const myUserId = req.user.id;
      const { other_user_id } = req.body;

      if (!other_user_id) {
        return res.status(400).json({ success: false, message: 'other_user_id is required' });
      }

      const result = await messagingService.getOrCreateConversation(myUserId, other_user_id);
      return res.status(result.isNew ? 201 : 200).json({ success: true, data: result });
    } catch (err: any) {
      const status = err.message.includes('not found') ? 404
        : err.message.includes('yourself') ? 400 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  }

  // GET /api/v1/messages/conversations
  async listConversations(req: AuthRequest, res: Response) {
    try {
      const myUserId = req.user.id;
      const data = await messagingService.listConversations(myUserId);
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/v1/messages/conversations/:conversationId
  async getMessages(req: AuthRequest, res: Response) {
    try {
      const myUserId = req.user.id;
      const conversationId = req.params.conversationId as string;
      const cursor = (req.query.cursor as string) || null;

      const data = await messagingService.getMessages(conversationId, myUserId, cursor);
      return res.json({ success: true, data });
    } catch (err: any) {
      const status = err.message.includes('not found') ? 404 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  }

  // POST /api/v1/messages/conversations/:conversationId/read
  async markRead(req: AuthRequest, res: Response) {
    try {
      const myUserId = req.user.id;
      const conversationId = req.params.conversationId as string;
      const data = await messagingService.markRead(conversationId, myUserId);
      return res.json({ success: true, data });
    } catch (err: any) {
      const status = err.message.includes('not found') ? 404 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  }

  // DELETE /api/v1/messages/conversations/:conversationId
  async archiveConversation(req: AuthRequest, res: Response) {
    try {
      const myUserId = req.user.id;
      const conversationId = req.params.conversationId as string;
      const data = await messagingService.archiveConversation(conversationId, myUserId);
      return res.json({ success: true, data });
    } catch (err: any) {
      const status = err.message.includes('not found') ? 404 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  }

  // GET /api/v1/messages/presence/:userId
  async getUserPresence(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.userId as string;
      const data = await messagingService.getUserPresence(userId);
      return res.json({ success: true, data });
    } catch (err: any) {
      const status = err.message.includes('not found') ? 404 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  }
}
