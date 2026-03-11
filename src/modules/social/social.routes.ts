import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/saved-profiles', authMiddleware, (req, res) => { res.json({ success: true, msg: 'Get saved profiles — coming soon' }); });
router.post('/reports', authMiddleware, (req, res) => { res.json({ success: true, msg: 'Report user — coming soon' }); });
router.get('/blocks', authMiddleware, (req, res) => { res.json({ success: true, msg: 'Get blocks — coming soon' }); });

export default router;
