import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { AUTH_ERRORS } from '../constants/error-messages';

export interface AuthRequest extends Request {
  user?: User;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: AUTH_ERRORS.NOT_AUTHENTICATED });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as {
      userId: string;
    };

    const user = await User.findOneBy({ id: decoded.userId });

    if (!user) {
      res.status(401).json({ message: AUTH_ERRORS.USER_NOT_FOUND });
      return;
    }

    // Vérifier si l'utilisateur a toujours accès (dates)
    const now = new Date();
    if (user.endDate && now > user.endDate) {
      res.status(403).json({ message: AUTH_ERRORS.ACCESS_EXPIRED });
      return;
    }
    if (now < user.startDate) {
      res.status(403).json({ message: AUTH_ERRORS.ACCESS_NOT_STARTED });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: AUTH_ERRORS.INVALID_TOKEN });
    return;
  }
};
