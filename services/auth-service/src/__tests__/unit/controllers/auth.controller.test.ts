import { authController } from '../../../controllers/auth.controller';
import { userService } from '../../../services/user.service';
import { authService } from '../../../services/auth.service';
import { AppError } from '../../../utils/error.util';

// Mocks
jest.mock('../../../services/user.service');
jest.mock('../../../services/auth.service');
jest.mock('../../../services/mail.service');

describe('AuthController', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRequest: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUser: any;

  beforeEach(() => {
    mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'collaborator',
      password: 'hashed_password',
      startDate: new Date(),
      endDate: null,
      save: jest.fn().mockResolvedValue(true),
    };

    mockRequest = {
      body: {},
      user: mockUser,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      mockRequest.body = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'collaborator',
        startDate: new Date(),
      };

      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      // Act
      await authController.register(mockRequest, mockResponse);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
        }),
      });
    });

    it('should handle registration errors', async () => {
      // Arrange
      const error = new AppError('User already exists', 400);
      (userService.createUser as jest.Mock).mockRejectedValue(error);

      // Act
      await authController.register(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User already exists',
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Arrange
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (authService.validateCredentials as jest.Mock).mockResolvedValue(
        mockUser
      );
      (authService.validateAccess as jest.Mock).mockResolvedValue(undefined);
      (authService.generateTokens as jest.Mock).mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      // Act
      await authController.login(mockRequest, mockResponse);

      // Assert
      expect(authService.validateCredentials).toHaveBeenCalledWith(
        mockRequest.body.email,
        mockRequest.body.password
      );
      expect(authService.validateAccess).toHaveBeenCalledWith(mockUser);
      expect(authService.generateTokens).toHaveBeenCalledWith(mockUser.id);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        'access-token',
        expect.any(Object)
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
        }),
      });
    });

    it('should handle login errors', async () => {
      // Arrange
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const error = new AppError('Invalid credentials', 401);
      (authService.validateCredentials as jest.Mock).mockRejectedValue(error);

      // Act
      await authController.login(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      // Act
      await authController.getCurrentUser(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
        }),
      });
    });

    it('should handle unauthorized request', async () => {
      // Arrange
      mockRequest.user = null;

      // Act
      await authController.getCurrentUser(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Not authenticated',
      });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Act
      await authController.logout(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'token',
        expect.any(Object)
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });
});
