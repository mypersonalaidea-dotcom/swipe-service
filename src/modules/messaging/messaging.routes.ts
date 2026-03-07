import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => { res.json({ msg: 'List conversations' }); });
router.get('/:id', (req, res) => { res.json({ msg: 'Get conversation messages' }); });

export default router;
