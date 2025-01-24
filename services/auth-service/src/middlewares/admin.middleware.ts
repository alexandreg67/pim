import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      message: 'Accès refusé. Privilèges administrateur requis.',
    });
    return;
  }
  next();
};
