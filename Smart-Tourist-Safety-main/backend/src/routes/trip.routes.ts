import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { createTrip, listTrips, getTripById, updateTrip, deleteTrip } from '../controllers/trip.controller';

const router = Router();

// Create trip
router.post(
  '/create',
  authMiddleware,
  [
    body('startLocation').isString().notEmpty(),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('monitoringStart').optional().isString(),
    body('monitoringEnd').optional().isString(),
    body('emergencyContact').optional().isString(),
    body('destinations').optional().isArray(),
    body('stays').optional().isArray(),
  ],
  validate,
  createTrip
);

// Get all trips for user
router.get('/', authMiddleware, listTrips);

// Get single trip by ID
router.get('/:id', authMiddleware, getTripById);

// Update trip
router.put('/:id', authMiddleware, updateTrip);

// Delete trip
router.delete('/:id', authMiddleware, deleteTrip);

export default router;
