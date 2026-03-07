import { Router } from 'express';

const router = Router();

router.get('/dashboard', (req, res) => { res.json({ msg: 'Admin dashboard' }); });

export default router;
