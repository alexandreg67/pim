import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRoutes } from '../../routes/auth.routes';
// import { User } from '../../entities/User';
// import bcrypt from 'bcrypt';
// import { AppDataSource } from '../../config/database';

// Ce test nécessitera une DB SQLite en mémoire
describe('Auth API E2E Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    // Initialiser l'application Express pour les tests
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/auth', authRoutes);

    // Ici, nous pourrions initialiser une connexion SQLite si nécessaire
    // Pour l'instant, on utilisera les mocks existants
  });

  afterAll(async () => {
    // Nettoyage
  });

  it('should return 401 when accessing a protected route without token', async () => {
    const response = await request(app).get('/auth/me');
    expect(response.status).toBe(401);
  });

  // Ajoutez d'autres tests E2E ici
});
