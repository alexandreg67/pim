import bcrypt from 'bcrypt';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';
import { MailService } from './mail.service';
import { generateTemporaryPassword } from '../utils/password.util';
import { AppError } from '../utils/error.util';
import { authService } from './auth.service';
import { AppDataSource } from '../config/database';

export class UserService {
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    startDate: Date;
    endDate?: Date;
    role: string;
  }): Promise<User> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Générer un mot de passe temporaire
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await authService.hashPassword(temporaryPassword);

    const user = new User();
    user.email = userData.email;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.role = userData.role;
    user.startDate = userData.startDate;
    if (userData.endDate) {
      user.endDate = userData.endDate;
    }
    user.password = hashedPassword;
    user.isFirstLogin = true;

    await user.save();

    // Envoyer l'email avec le mot de passe temporaire
    await MailService.sendMail({
      to: user.email,
      template: 'TEMP_PASSWORD',
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        temporaryPassword,
      },
    });

    return user;
  }

  async updateUserPassword(
    user: User,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400);
    }

    user.password = await authService.hashPassword(newPassword);
    user.isFirstLogin = false;
    await user.save();

    // Envoyer un email de confirmation
    await MailService.sendMail({
      to: user.email,
      template: 'PASSWORD_CHANGED',
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  async resetPassword(email: string): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { email },
      });

      if (!user) {
        await queryRunner.rollbackTransaction();
        return; // Silencieux pour la sécurité
      }

      const temporaryPassword = generateTemporaryPassword();
      const hashedPassword = await authService.hashPassword(temporaryPassword);

      user.password = hashedPassword;
      user.isFirstLogin = true;
      await queryRunner.manager.save(user);

      try {
        await MailService.sendMail({
          to: email,
          template: 'TEMP_PASSWORD',
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            temporaryPassword,
          },
        });

        await queryRunner.commitTransaction();
      } catch {
        await queryRunner.rollbackTransaction();
        throw new AppError('Failed to send reset password email', 500);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    user: User;
    token: string;
  }> {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid credentials');

    // Vérification des dates d'accès
    const now = new Date();
    if (now < user.startDate || (user.endDate && now > user.endDate)) {
      throw new Error('Account access period invalid');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return { user, token };
  }
}

export const userService = new UserService();
