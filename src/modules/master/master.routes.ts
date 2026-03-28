import { Router } from 'express';
import { MasterController } from './master.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const masterController = new MasterController();

// Specific master lookup endpoints are public to support the onboarding/signup flow.
router.get('/degrees', masterController.getDegrees);
router.get('/positions', masterController.getPositions);
router.get('/companies', masterController.getCompanies);
router.get('/institutions', masterController.getInstitutions);

// These lookup endpoints still require authentication.
router.get('/habits', authMiddleware, masterController.getHabits);
router.get('/amenities', authMiddleware, masterController.getAmenities);

// Creation endpoints for entities used during onboarding are now public.
router.post('/degrees', masterController.createDegree);
router.post('/positions', masterController.createPosition);
router.post('/companies', masterController.createCompany);
router.post('/institutions', masterController.createInstitution);

export default router;
