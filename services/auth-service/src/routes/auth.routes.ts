import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validate.middleware';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { adminMiddleware } from '../middlewares/admin.middleware';
import {
  loginLimiter,
  resetPasswordLimiter,
} from '../middlewares/rateLimiter.middleware';

const router = Router();

// Routes publiques
router.post(
  '/login',
  loginLimiter,
  validateDto(LoginDto),
  authController.login
);
router.post(
  '/reset-password',
  resetPasswordLimiter,
  authController.resetPassword
);

// Routes protégées (admin uniquement)
router.post(
  '/register',
  authMiddleware,
  adminMiddleware,
  validateDto(RegisterDto),
  authController.register
);

router.get('/verify', authMiddleware, authController.verifyToken);

// Routes protégées (utilisateur connecté)
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post('/logout', authMiddleware, authController.logout);
router.put('/change-password', authMiddleware, authController.changePassword);
export { router as authRoutes };
