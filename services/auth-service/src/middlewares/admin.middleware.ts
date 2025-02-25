import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AUTH_ERRORS } from '../constants/error-messages';

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      message: AUTH_ERRORS.ADMIN_REQUIRED,
    });
    return;
  }
  next();
};
