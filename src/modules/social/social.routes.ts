import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { SocialController } from './social.controller';

const router = Router();
const controller = new SocialController();

router.get('/saved-profiles', authMiddleware, (req, res) => controller.getSavedProfiles(req, res));
router.post('/save-profile', authMiddleware, (req, res) => controller.toggleSaveProfile(req, res));

router.post('/reports', authMiddleware, (req, res) => { res.json({ success: true, msg: 'Report user — coming soon' }); });
router.get('/blocks', authMiddleware, (req, res) => { res.json({ success: true, msg: 'Get blocks — coming soon' }); });

export default router;
