import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { DiscoverController } from './discover.controller';

const router = Router();
const controller = new DiscoverController();

// Get paginated profile cards for homepage feed
router.get('/feed', authMiddleware, (req, res) => controller.getFeed(req, res));

// Mark profiles as visited (so they don't appear again)
router.post('/visited', authMiddleware, (req, res) => controller.markVisited(req, res));

// Clear all visited profiles (reset feed)
router.delete('/visited', authMiddleware, (req, res) => controller.clearVisited(req, res));

export default router;
