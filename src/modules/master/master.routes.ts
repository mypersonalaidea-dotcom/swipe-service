import { Router } from 'express';
import { MasterController } from './master.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const masterController = new MasterController();

// All master lookup endpoints require authentication —
// prevents anonymous browsers from enumerating the data.
router.get('/degrees', authMiddleware, masterController.getDegrees);
router.get('/positions', authMiddleware, masterController.getPositions);
router.get('/companies', authMiddleware, masterController.getCompanies);
router.get('/institutions', authMiddleware, masterController.getInstitutions);
router.get('/habits', authMiddleware, masterController.getHabits);
router.get('/amenities', authMiddleware, masterController.getAmenities);

export default router;
