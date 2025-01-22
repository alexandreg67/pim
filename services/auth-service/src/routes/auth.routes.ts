// src/routes/auth.routes.ts
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validate.middleware';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// Routes publiques
router.post('/login', validateDto(LoginDto), authController.login);
router.post('/reset-password', authController.resetPassword);

// Routes protégées (admin uniquement)
router.post(
  '/register',
  authMiddleware,
  adminMiddleware,
  validateDto(RegisterDto),
  authController.register
);

// Routes protégées (utilisateur connecté)
router.get('/me', authController.getCurrentUser); // Ajout de authMiddleware
router.post('/logout', authController.logout); // Ajout de authMiddleware
router.put('/change-password', authController.changePassword); // Ajout de authMiddleware

export { router as authRoutes };
