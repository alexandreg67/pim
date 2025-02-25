import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRoutes } from '../../routes/auth.routes';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
import { User } from '../../entities/User';

// Mocks
jest.mock('../../services/auth.service');
jest.mock('../../services/user.service');
jest.mock('../../entities/User');

describe('Auth API Routes', () => {
  let app: express.Application;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUser: any;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/auth', authRoutes);
  });

  beforeEach(() => {
    mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'collaborator',
      startDate: new Date(),
      endDate: null,
    };

    // Réinitialiser les mocks
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const loginData = {
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
      const response = await request(app).post('/auth/login').send(loginData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', mockUser.id);
      expect(response.body.user).toHaveProperty('email', mockUser.email);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 with invalid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      (authService.validateCredentials as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      // Act
      const response = await request(app).post('/auth/login').send(loginData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('POST /auth/register', () => {
    it('should block unauthorized registration attempts', async () => {
      // Arrange
      const userData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'collaborator',
        startDate: new Date(),
      };

      // Act
      const response = await request(app).post('/auth/register').send(userData);

      // Assert
      expect(response.status).toBe(401);
      expect(userService.createUser).not.toHaveBeenCalled();
    });

    // Pour tester les routes protégées, il faudrait simuler l'authentification
  });

  describe('GET /auth/me', () => {
    it('should return user data for authenticated user', async () => {
      // Arrange
      // Simuler un utilisateur authentifié
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Les tests suivants nécessitent un middleware de simulation d'authentification
    });
  });
});
