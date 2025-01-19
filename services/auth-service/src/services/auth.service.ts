import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { AppError } from '../utils/error.util';

export class AuthService {
  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    return user;
  }

  async validateAccess(user: User): Promise<void> {
    const now = new Date();

    if (user.end_date && now > user.end_date) {
      throw new AppError('Access expired', 403);
    }

    if (now < user.start_date) {
      throw new AppError('Access not yet started', 403);
    }
  }

  generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    const refreshToken = jwt.sign({ userId }, jwtConfig.secret, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

export const authService = new AuthService();
