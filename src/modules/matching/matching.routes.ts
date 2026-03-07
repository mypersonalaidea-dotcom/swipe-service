import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => { res.json({ msg: 'Discover profiles' }); });
router.post('/swipe', (req, res) => { res.json({ msg: 'Swipe profile' }); });

export default router;
