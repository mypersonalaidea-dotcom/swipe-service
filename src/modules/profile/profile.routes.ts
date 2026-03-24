import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const c = new ProfileController();

// Profile
router.get('/', authMiddleware, c.getMyProfile);
router.put('/', authMiddleware, c.updateMyProfile);

// Jobs (all require auth)
router.get('/jobs', authMiddleware, c.getJobs);
router.post('/jobs', authMiddleware, c.addJob);
router.put('/jobs/:jobId', authMiddleware, c.updateJob);
router.delete('/jobs/:jobId', authMiddleware, c.deleteJob);

// Education (all require auth)
router.get('/education', authMiddleware, c.getEducation);
router.post('/education', authMiddleware, c.addEducation);
router.put('/education/:eduId', authMiddleware, c.updateEducation);
router.delete('/education/:eduId', authMiddleware, c.deleteEducation);

// My habits (all require auth)
router.get('/habits', authMiddleware, c.getHabits);
router.put('/habits', authMiddleware, c.setHabits);

// Looking-for habits (all require auth)
router.get('/looking-for', authMiddleware, c.getLookingForHabits);
router.put('/looking-for', authMiddleware, c.setLookingForHabits);

// Search preferences (all require auth)
router.get('/search-preferences', authMiddleware, c.getSearchPreferences);
router.put('/search-preferences', authMiddleware, c.updateSearchPreferences);

// Public profile by ID — must be LAST to avoid swallowing named routes above
router.get('/:id', c.getProfileById);

export default router;
