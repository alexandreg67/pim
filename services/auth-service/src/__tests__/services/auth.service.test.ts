import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/error.util';

// Mock des dépendances
jest.mock('../../entities/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUser: Partial<User>;

  beforeEach(() => {
    authService = new AuthService();
    mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'Test',
      lastName: 'User',
      startDate: new Date(),
      endDate: undefined,
    };

    jest.clearAllMocks();
  });

  describe('validateCredentials', () => {
    it('should validate user credentials successfully', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await authService.validateCredentials(
        'test@example.com',
        'password'
      );

      // Assert
      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    });

    it('should throw error when user not found', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.validateCredentials('nonexistent@example.com', 'password')
      ).rejects.toThrow(new AppError('Invalid credentials', 401));
    });

    it('should throw error when password is invalid', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        authService.validateCredentials('test@example.com', 'wrongpassword')
      ).rejects.toThrow(new AppError('Invalid credentials', 401));
    });
  });

  describe('validateAccess', () => {
    it('should validate active user access', async () => {
      // Arrange
      const activeUser = {
        ...mockUser,
        startDate: new Date(Date.now() - 86400000), // 1 day ago
        endDate: new Date(Date.now() + 86400000), // 1 day in future
      };

      // Act & Assert
      await expect(
        authService.validateAccess(activeUser as User)
      ).resolves.not.toThrow();
    });

    it('should throw error when user access expired', async () => {
      // Arrange
      const expiredUser = {
        ...mockUser,
        startDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
        endDate: new Date(Date.now() - 86400000), // 1 day ago
      };

      // Act & Assert
      await expect(
        authService.validateAccess(expiredUser as User)
      ).rejects.toThrow(new AppError('Access expired', 403));
    });

    it('should throw error when user access not yet started', async () => {
      // Arrange
      const futureUser = {
        ...mockUser,
        startDate: new Date(Date.now() + 86400000), // 1 day in future
      };

      // Act & Assert
      await expect(
        authService.validateAccess(futureUser as User)
      ).rejects.toThrow(new AppError('Access not yet started', 403));
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      // Arrange
      const userId = '1';
      const mockAccessToken = 'access-token';
      const mockRefreshToken = 'refresh-token';

      (jwt.sign as jest.Mock).mockImplementation((payload, secret) => {
        if (secret === process.env.JWT_ACCESS_TOKEN_SECRET) {
          return mockAccessToken;
        }
        return mockRefreshToken;
      });

      // Act
      const result = authService.generateTokens(userId);

      // Assert
      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
      expect(jwt.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      // Arrange
      const password = 'password123';
      const salt = 'generated-salt';
      const hashedPassword = 'hashed-password';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      // Act
      const result = await authService.hashPassword(password);

      // Assert
      expect(result).toEqual(hashedPassword);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    });
  });
});
