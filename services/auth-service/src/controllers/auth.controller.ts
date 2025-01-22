// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import { User } from '../entities/User';

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

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const { currentPassword, newPassword } = req.body;
      await userService.updateUserPassword(user, currentPassword, newPassword);

      res.json({ message: 'Password updated successfully' });
    } catch (error: unknown) {
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
      await userService.resetPassword(email);

      res.json({
        message:
          'If an account exists with that email, a password reset link has been sent',
      });
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      res.status(500).json({
        message: 'Error processing password reset',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
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
