import { Router } from 'express';
import { FlatsController } from './flats.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const flatsController = new FlatsController();

router.get('/', flatsController.getFlats);
router.get('/:id', flatsController.getFlatById);
router.post('/', authMiddleware, flatsController.createFlat);

export default router;
