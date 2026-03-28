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

// Creation endpoints (require auth)
router.post('/degrees', authMiddleware, masterController.createDegree);
router.post('/positions', authMiddleware, masterController.createPosition);
router.post('/companies', authMiddleware, masterController.createCompany);
router.post('/institutions', authMiddleware, masterController.createInstitution);

export default router;
