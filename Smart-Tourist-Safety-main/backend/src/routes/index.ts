import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import tripRoutes from './trip.routes';
import incidentRoutes from './incident.routes';


const router = Router();


router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/trip', tripRoutes);
router.use('/incident', incidentRoutes);


export default router;