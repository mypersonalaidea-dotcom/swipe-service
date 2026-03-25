import { Router } from 'express';
import { SearchPreferenceController } from './search-preference.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const c = new SearchPreferenceController();

// Main search preference (GET / PUT / DELETE)
router.get('/', authMiddleware, c.get);
router.put('/', authMiddleware, c.upsert);
router.delete('/', authMiddleware, c.remove);

// Filter habits
router.get('/filter-habits', authMiddleware, c.getFilterHabits);
router.put('/filter-habits', authMiddleware, c.setFilterHabits);

// Filter amenities
router.get('/filter-amenities', authMiddleware, c.getFilterAmenities);
router.put('/filter-amenities', authMiddleware, c.setFilterAmenities);

// Filter companies
router.get('/filter-companies', authMiddleware, c.getFilterCompanies);
router.put('/filter-companies', authMiddleware, c.setFilterCompanies);

// Filter institutions
router.get('/filter-institutions', authMiddleware, c.getFilterInstitutions);
router.put('/filter-institutions', authMiddleware, c.setFilterInstitutions);

export default router;
