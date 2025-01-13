import bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { MailService } from './mail.service';
import { generateTemporaryPassword } from '../utils/password.util';
import { AppError } from '../utils/error.util';
import { authService } from './auth.service';

export class UserService {
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    startDate: Date;
    endDate?: Date;
    isAdmin?: boolean;
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

    // Créer l'utilisateur
    // const user = User.create({
    //   ...userData,
    //   password: hashedPassword,
    //   is_first_login: true,
    // });

    const user = new User();
    user.email = userData.email;
    user.first_name = userData.firstName;
    user.last_name = userData.lastName;
    user.start_date = userData.startDate;
    user.password = hashedPassword;

    await user.save();

    // Envoyer l'email avec le mot de passe temporaire
    await MailService.sendMail({
      to: user.email,
      template: 'TEMP_PASSWORD',
      data: {
        firstName: user.first_name,
        lastName: user.last_name,
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
    user.is_first_login = false;
    await user.save();

    // Envoyer un email de confirmation
    await MailService.sendMail({
      to: user.email,
      template: 'PASSWORD_CHANGED',
      data: {
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  }

  async resetPassword(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'utilisateur existe
      return;
    }

    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await authService.hashPassword(temporaryPassword);

    user.password = hashedPassword;
    user.is_first_login = true;
    await user.save();

    await MailService.sendMail({
      to: email,
      template: 'TEMP_PASSWORD',
      data: {
        firstName: user.first_name,
        lastName: user.last_name,
        temporaryPassword,
      },
    });
  }
}

export const userService = new UserService();
