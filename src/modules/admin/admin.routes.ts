import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// TODO: Add an admin role check middleware here in addition to authMiddleware
router.get('/dashboard', authMiddleware, (_req, res) => {
  res.json({ msg: 'Admin dashboard — JWT required' });
});

export default router;
