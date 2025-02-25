import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/User';
import bcrypt from 'bcrypt';

// Mock des dépendances
jest.mock('../../entities/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('validateCredentials', () => {
    it('should validate user credentials successfully', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
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
  });
});
