// services/auth-service/src/__tests__/middlewares/auth.middleware.test.ts
import { authMiddleware } from '../../middlewares/auth.middleware';
import { User } from '../../entities/User';
import jwt from 'jsonwebtoken';
import { AUTH_ERRORS } from '../../constants/error-messages';

// Mocks
jest.mock('jsonwebtoken');
jest.mock('../../entities/User');

describe('authMiddleware', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRequest: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse: any;
  let mockNext: jest.Mock;
  let mockUser: Partial<User>;

  beforeEach(() => {
    mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'collaborator',
      startDate: new Date(),
      endDate: undefined,
    };

    mockRequest = {
      cookies: {},
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    // Mock findOneBy au lieu de findOne
    (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

    // Mock direct de verify sans callback
    (jwt.verify as jest.Mock).mockImplementation((token) => {
      if (token === 'valid-token') {
        return { userId: '1' };
      } else {
        throw new Error('Invalid token');
      }
    });

    jest.clearAllMocks();
  });

  it('should allow authenticated requests with valid cookie token', async () => {
    // Arrange
    mockRequest.cookies.token = 'valid-token';

    // Act
    await authMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(jwt.verify).toHaveBeenCalled();
    expect(User.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(mockRequest.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject requests with invalid token', async () => {
    // Arrange
    mockRequest.cookies.token = 'invalid-token';

    // Act
    await authMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: AUTH_ERRORS.INVALID_TOKEN,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject requests without token', async () => {
    // Act
    await authMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: AUTH_ERRORS.NOT_AUTHENTICATED,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject requests when user not found', async () => {
    // Arrange
    mockRequest.cookies.token = 'valid-token';
    (User.findOneBy as jest.Mock).mockResolvedValue(null);

    // Act
    await authMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Utilisateur non trouvé',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject requests if user access is expired', async () => {
    // Arrange
    mockRequest.cookies.token = 'valid-token';
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1); // Date d'hier
    mockUser.endDate = expiredDate;
    (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

    // Act
    await authMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: AUTH_ERRORS.ACCESS_EXPIRED,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject requests if user access has not started yet', async () => {
    // Arrange
    mockRequest.cookies.token = 'valid-token';
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Date de demain
    mockUser.startDate = futureDate;
    (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

    // Act
    await authMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: AUTH_ERRORS.ACCESS_NOT_STARTED,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
