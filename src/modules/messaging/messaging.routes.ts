import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, (req, res) => { res.json({ success: true, msg: 'List conversations — coming soon' }); });
router.get('/:id', authMiddleware, (req, res) => { res.json({ success: true, msg: 'Get conversation messages — coming soon' }); });

export default router;
