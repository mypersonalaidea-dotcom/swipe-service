import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const profileController = new ProfileController();

router.get('/', authMiddleware, profileController.getMyProfile);
router.put('/', authMiddleware, profileController.updateMyProfile);
router.get('/:id', profileController.getProfileById);

export default router;
