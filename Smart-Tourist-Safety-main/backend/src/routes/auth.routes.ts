import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], validate, register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], validate, login);

// ✅ Add this route
router.get('/me', authMiddleware, getMe);

export default router;
