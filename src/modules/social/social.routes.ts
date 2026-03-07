import { Router } from 'express';

const router = Router();

router.get('/saved-profiles', (req, res) => { res.json({ msg: 'Get saved profiles' }); });
router.post('/reports', (req, res) => { res.json({ msg: 'Report user' }); });
router.get('/blocks', (req, res) => { res.json({ msg: 'Get blocks' }); });

export default router;
