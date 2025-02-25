// services/auth-service/src/__tests__/services/user.service.test.ts
import { UserService } from '../../../services/user.service';
import { User } from '../../../entities/User';
import { MailService } from '../../../services/mail.service';
import { authService } from '../../../services/auth.service';
import { AppDataSource } from '../../../config/database';
import { AppError } from '../../../utils/error.util';
import { EntityManager } from 'typeorm';
import { QueryRunner } from 'typeorm';

// Mocks
jest.mock('../../../entities/User');
jest.mock('../../../services/mail.service');
jest.mock('../../../services/auth.service');
jest.mock('../../../config/database');

describe('UserService', () => {
  let userService: UserService;
  let mockUser: Partial<User>;
  let mockQueryRunner: ReturnType<typeof AppDataSource.createQueryRunner>;

  beforeEach(() => {
    userService = new UserService();

    mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'collaborator',
      password: 'hashed_password',
      startDate: new Date(),
      save: jest.fn().mockResolvedValue(true),
      isFirstLogin: true,
    };

    mockQueryRunner = {
      connect: jest.fn().mockResolvedValue(null),
      startTransaction: jest.fn().mockResolvedValue(null),
      commitTransaction: jest.fn().mockResolvedValue(null),
      rollbackTransaction: jest.fn().mockResolvedValue(null),
      release: jest.fn().mockResolvedValue(null),
      manager: {
        findOne: jest.fn(),
        save: jest.fn(),
      } as unknown as EntityManager,
    } as unknown as QueryRunner;

    (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(
      mockQueryRunner
    );
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.prototype.save as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
    (MailService.sendMail as jest.Mock).mockResolvedValue({ success: true });
    (authService.hashPassword as jest.Mock).mockResolvedValue(
      'hashed_password'
    );

    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        startDate: new Date(),
        role: 'collaborator',
      };

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(authService.hashPassword).toHaveBeenCalled();
      expect(MailService.sendMail).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.email).toEqual(userData.email);
    });

    it('should throw error when user already exists', async () => {
      // Arrange
      const existingUserData = {
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
        startDate: new Date(),
        role: 'collaborator',
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: existingUserData.email,
      });

      // Act & Assert
      await expect(userService.createUser(existingUserData)).rejects.toThrow(
        new AppError('User already exists', 400)
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset user password successfully', async () => {
      // Arrange
      const email = 'test@example.com';
      (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(
        mockUser
      );

      // Act
      await userService.resetPassword(email);

      // Assert
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalled();
      expect(MailService.sendMail).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should not throw error when user not found (security by obscurity)', async () => {
      // Arrange
      const nonExistentEmail = 'nonexistent@example.com';
      (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        userService.resetPassword(nonExistentEmail)
      ).resolves.not.toThrow();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(MailService.sendMail).not.toHaveBeenCalled();
    });

    it('should rollback transaction when email service fails', async () => {
      // Arrange
      const email = 'test@example.com';
      (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(
        mockUser
      );
      (MailService.sendMail as jest.Mock).mockRejectedValue(
        new Error('Mail error')
      );

      // Act & Assert
      await expect(userService.resetPassword(email)).rejects.toThrow();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
