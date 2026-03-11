import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, (req, res) => { res.json({ success: true, msg: 'Discover profiles — coming soon' }); });
router.post('/swipe', authMiddleware, (req, res) => { res.json({ success: true, msg: 'Swipe profile — coming soon' }); });

export default router;
