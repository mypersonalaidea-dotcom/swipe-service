import { Router } from 'express';
import { MasterController } from './master.controller';

const router = Router();
const masterController = new MasterController();

router.get('/degrees', masterController.getDegrees);
router.get('/positions', masterController.getPositions);
router.get('/companies', masterController.getCompanies);
router.get('/institutions', masterController.getInstitutions);
router.get('/habits', masterController.getHabits);
router.get('/amenities', masterController.getAmenities);

export default router;
