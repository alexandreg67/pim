import { AUTH_ERRORS } from '../../constants/error-messages';
import { adminMiddleware } from '../../middlewares/admin.middleware';

describe('adminMiddleware', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRequest: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      user: {
        role: 'collaborator',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  it('should allow admin users', () => {
    // Arrange
    mockRequest.user.role = 'admin';

    // Act
    adminMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject non-admin users', () => {
    // Act
    adminMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: AUTH_ERRORS.ADMIN_REQUIRED,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
