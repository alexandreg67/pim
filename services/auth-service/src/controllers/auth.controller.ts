// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import { User } from '../entities/User';
import { MailService } from '../services/mail.service';
import { AppError } from '../utils/error.util';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const err = error as Error & { statusCode?: number };
      res.status(err.statusCode || 500).json({
        message: err.message || 'An error occurred during registration',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await authService.validateCredentials(email, password);
      await authService.validateAccess(user);

      const { accessToken } = await authService.generateTokens(user.id);

      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error: unknown) {
      console.error('Login error:', error);
      const err = error as Error & { statusCode?: number };
      res.status(err.statusCode || 401).json({
        message: (error as Error).message || 'Invalid credentials',
      });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          startDate: user.startDate,
          endDate: user.endDate,
        },
      });
    } catch (error: unknown) {
      console.error('Get current user error:', error as Error);
      const err = error as Error & { statusCode?: number };
      res.status(err.statusCode || 500).json({
        message: err.message || 'Error fetching user data',
      });
    }
  }

  async verifyToken(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const now = new Date();
      const isActive =
        (!req.user.endDate || now <= req.user.endDate) &&
        now >= req.user.startDate;

      if (!isActive) {
        res.status(403).json({ message: 'User access period invalid' });
        return;
      }

      res.json({
        userId: req.user.id,
        role: req.user.role,
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({ message: 'Error verifying token' });
    }
  }

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        throw new AppError('Not authenticated', 401);
      }

      const { currentPassword, newPassword } = req.body;
      await authService.validateCredentials(user.email, currentPassword);

      // Hachage et mise à jour du mot de passe
      const hashedPassword = await authService.hashPassword(newPassword);
      user.password = hashedPassword;
      user.isFirstLogin = false;
      await user.save();

      // Envoi de l'email de confirmation
      await MailService.sendMail({
        to: user.email,
        template: 'PASSWORD_CHANGED',
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      const err = error as Error & { statusCode?: number };
      res.status(err.statusCode || 500).json({
        message: err.message || 'Error changing password',
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      // On délègue tout le travail au service
      await userService.resetPassword(email);

      // On renvoie toujours le même message pour la sécurité
      res.json({
        message: "Si l'adresse email existe, les instructions ont été envoyées",
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        message: 'Une erreur est survenue lors de la réinitialisation',
      });
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Effacer le cookie JWT
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      // Journalisation de la déconnexion
      console.info(`User ${req.user?.id} logged out successfully`);

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Error during logout' });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await User.find({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  }
}

export const authController = new AuthController();
