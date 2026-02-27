import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getProfile, updateProfile } from '../controllers/profile.controller';


const router = Router();


router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);


export default router;