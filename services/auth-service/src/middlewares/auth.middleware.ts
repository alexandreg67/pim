import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

export interface AuthRequest extends Request {
  user?: User;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await User.findOneBy({ id: decoded.userId });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur a toujours accès (dates)
    const now = new Date();
    if (user.end_date && now > user.end_date) {
      return res.status(403).json({ message: 'Accès expiré' });
    }
    if (now < user.start_date) {
      return res
        .status(403)
        .json({ message: "L'accès n'a pas encore commencé" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide' });
  }
};
