// import { Router } from 'express';
// import { authMiddleware } from '../middleware/auth.middleware';
// import { reportIncident, listIncidents, getIncident, panicIncident, emergencyNotify, efirIncident } from '../controllers/incident.controller';
// import { body } from 'express-validator';
// import { validate } from '../middleware/validate.middleware';


// const router = Router();


// router.post('/report', authMiddleware, [
// body('type').isString().notEmpty(),
// body('location').isObject(),
// body('description').optional().isString()
// ], validate, reportIncident);

// router.post("/panic", authMiddleware, panicIncident);
// router.get('/', authMiddleware, listIncidents);
// router.get('/:id', authMiddleware, getIncident);
// router.post("/emergency", authMiddleware, emergencyNotify);
// router.post("/efir", authMiddleware, efirIncident);

// export default router;

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  reportIncident,
  listIncidents,
  getIncident,
  panicIncident,
  emergencyNotify,
  efirIncident
} from '../controllers/incident.controller';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import multer from 'multer';
import path from 'path';

const router = Router();

// Multer config for EFIR file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/efir')); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Incident routes
router.post(
  '/report',
  authMiddleware,
  [
    body('type').isString().notEmpty(),
    body('location').isObject(),
    body('description').optional().isString()
  ],
  validate,
  reportIncident
);

router.post("/panic", authMiddleware, panicIncident);
router.get('/', authMiddleware, listIncidents);
router.get('/:id', authMiddleware, getIncident);
router.post("/emergency", authMiddleware, emergencyNotify);

// Updated EFIR route with file upload support
router.post("/efir", authMiddleware, upload.array('files', 10), efirIncident);

export default router;
